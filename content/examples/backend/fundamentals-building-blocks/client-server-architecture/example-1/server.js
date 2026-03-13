// HTTP server exposing a small API contract for items and sessions.

const http = require("http");
const { URL } = require("url");
const protocol = require("./protocol");
const service = require("./service");

function readBody(req) {
  return new Promise((resolve) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString("utf8");
    });
    req.on("end", () => resolve(body));
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  try {
    if (req.method === "GET" && url.pathname === "/items") {
      return protocol.ok(res, service.listItems());
    }

    if (req.method === "GET" && url.pathname.startsWith("/items/")) {
      const id = Number(url.pathname.split("/")[2]);
      const item = service.getItem(id);
      if (!item) return protocol.notFound(res, "Item not found.");
      return protocol.ok(res, item);
    }

    if (req.method === "POST" && url.pathname === "/items") {
      const raw = await readBody(req);
      const input = raw ? JSON.parse(raw) : {};
      const result = service.createItem(input);
      if (result.error) return protocol.badRequest(res, result.error);
      return protocol.created(res, result.item);
    }

    if (req.method === "POST" && url.pathname === "/sessions") {
      const raw = await readBody(req);
      const input = raw ? JSON.parse(raw) : {};
      if (!input.clientId) {
        return protocol.badRequest(res, "clientId is required.");
      }
      return protocol.created(res, service.startSession(input.clientId));
    }

    if (req.method === "POST" && url.pathname === "/sessions/hit") {
      const raw = await readBody(req);
      const input = raw ? JSON.parse(raw) : {};
      const session = service.hitSession(input.clientId);
      if (!session) return protocol.notFound(res, "Session not found.");
      return protocol.ok(res, session);
    }

    return protocol.notFound(res, "Route not found.");
  } catch (error) {
    return protocol.internalError(res, "Unexpected server error.");
  }
});

server.listen(4001, () => {
  console.log("Client-Server demo running on http://localhost:4001");
});
