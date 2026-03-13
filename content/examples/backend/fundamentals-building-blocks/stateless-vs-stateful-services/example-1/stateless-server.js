// Stateless server using signed tokens instead of server-side sessions.

const http = require("http");
const crypto = require("crypto");

const secret = "demo-secret";

function sign(payload) {
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = crypto.createHmac("sha256", secret).update(body).digest("base64url");
  return `${body}.${sig}`;
}

function verify(token) {
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  const expected = crypto.createHmac("sha256", secret).update(body).digest("base64url");
  if (expected !== sig) return null;
  return JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
}

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
    const token = sign({ userId: "user-1", issuedAt: Date.now() });
    return respond(res, 201, { token });
  }

  if (req.method === "GET" && req.url.startsWith("/profile")) {
    const token = req.headers["authorization"]?.replace("Bearer ", "");
    const payload = token ? verify(token) : null;
    if (!payload) return respond(res, 401, { error: "invalid-token" });
    return respond(res, 200, { userId: payload.userId, session: "stateless" });
  }

  return respond(res, 404, { error: "not-found" });
});

server.listen(4051, () => {
  console.log("Stateless server on http://localhost:4051");
});
