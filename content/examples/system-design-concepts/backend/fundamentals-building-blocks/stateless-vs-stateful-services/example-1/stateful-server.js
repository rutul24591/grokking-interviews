// Stateful server storing sessions in memory.

const http = require("http");
const { randomUUID } = require("crypto");

const sessions = new Map();

function respond(res, statusCode, payload) {
  const body = JSON.stringify(payload, null, 2);
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": Buffer.byteLength(body),
  });
  res.end(body);
}

const server = http.createServer((req, res) => {
  if (req.method === "POST" && req.url === "/login") {
    const sessionId = randomUUID();
    sessions.set(sessionId, { userId: "user-1", createdAt: Date.now() });
    return respond(res, 201, { sessionId });
  }

  if (req.method === "GET" && req.url.startsWith("/profile")) {
    const sessionId = req.headers["x-session-id"];
    const session = sessions.get(sessionId);
    if (!session) return respond(res, 401, { error: "invalid-session" });
    return respond(res, 200, { userId: session.userId, session: "stateful" });
  }

  return respond(res, 404, { error: "not-found" });
});

server.listen(4050, () => {
  console.log("Stateful server on http://localhost:4050");
});
