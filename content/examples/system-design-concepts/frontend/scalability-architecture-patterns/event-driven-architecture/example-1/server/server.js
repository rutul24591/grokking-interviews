import http from "node:http";
import { randomUUID } from "node:crypto";

const PORT = Number(process.env.PORT ?? "4000");

/**
 * Very small in-memory event log (bounded). In production, events are durable.
 */
const HISTORY_LIMIT = 200;
const history = [];

/**
 * Connected SSE clients.
 * Map<clientId, ServerResponse>
 */
const clients = new Map();

function writeSse(res, { id, event, data }) {
  res.write(`id: ${id}\n`);
  res.write(`event: ${event}\n`);
  res.write(`data: ${JSON.stringify(data)}\n\n`);
}

function pushToHistory(evt) {
  history.push(evt);
  if (history.length > HISTORY_LIMIT) history.splice(0, history.length - HISTORY_LIMIT);
}

function broadcast(evt) {
  pushToHistory(evt);
  for (const res of clients.values()) writeSse(res, evt);
}

function sendReplay(res, lastEventId) {
  if (!lastEventId) return;
  const idx = history.findIndex((e) => e.id === lastEventId);
  if (idx < 0) return;
  for (const evt of history.slice(idx + 1)) writeSse(res, evt);
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      if (!body) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch (err) {
        reject(err);
      }
    });
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url ?? "/", `http://${req.headers.host ?? "localhost"}`);

  // CORS for local dev (demo only).
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Last-Event-ID");
  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    return res.end();
  }

  if (req.method === "GET" && url.pathname === "/events") {
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive"
    });
    res.write("\n");

    const clientId = randomUUID();
    clients.set(clientId, res);

    writeSse(res, {
      id: randomUUID(),
      event: "domain",
      data: {
        v: 1,
        ts: Date.now(),
        type: "connection.opened",
        data: { clientId }
      }
    });

    // Optional replay window.
    const lastEventId = req.headers["last-event-id"];
    if (typeof lastEventId === "string") sendReplay(res, lastEventId);

    req.on("close", () => {
      clients.delete(clientId);
    });
    return;
  }

  if (req.method === "POST" && url.pathname === "/publish") {
    try {
      const body = await readJson(req);
      const evt = {
        id: randomUUID(),
        event: "domain",
        data: {
          v: 1,
          ts: Date.now(),
          type: typeof body.type === "string" ? body.type : "demo.unknown",
          data: body.data ?? {}
        }
      };
      broadcast(evt);
      res.writeHead(202, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ ok: true, id: evt.id }));
    } catch {
      res.statusCode = 400;
      return res.end("Invalid JSON");
    }
  }

  if (req.method === "GET" && url.pathname === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ ok: true, clients: clients.size, history: history.length }));
  }

  res.statusCode = 404;
  res.end("Not Found");
});

setInterval(() => {
  broadcast({
    id: randomUUID(),
    event: "domain",
    data: { v: 1, ts: Date.now(), type: "heartbeat", data: { clients: clients.size } }
  });
}, 15000).unref();

server.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`SSE event server listening on http://localhost:${PORT}`);
});

