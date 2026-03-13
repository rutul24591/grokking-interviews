// HTTP server illustrating a request lifecycle pipeline.

const http = require("http");
const { randomUUID } = require("crypto");
const { withLogging, withAuth, withValidation } = require("./middleware");
const { handleRequest } = require("./handler");

function readBody(req) {
  return new Promise((resolve) => {
    let body = "";
    req.on("data", (chunk) => (body += chunk.toString("utf8")));
    req.on("end", () => resolve(body));
  });
}

function respond(res, statusCode, payload, requestId) {
  const body = JSON.stringify(payload, null, 2);
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": Buffer.byteLength(body),
    "x-request-id": requestId,
  });
  res.end(body);
}

const pipeline = withLogging(withAuth(withValidation(async (req, res, context) => {
  const result = await handleRequest(context);
  respond(res, 200, { data: result, logs: context.logs }, context.requestId);
})));

const server = http.createServer(async (req, res) => {
  if (req.method !== "POST" || req.url !== "/transform") {
    return respond(res, 404, { error: "not-found" }, "n/a");
  }

  const requestId = randomUUID();
  const raw = await readBody(req);
  const context = { requestId, body: raw ? JSON.parse(raw) : null, logs: [] };

  await pipeline(req, res, context);

  if (context.error) {
    respond(res, context.error.status, { error: context.error.message }, requestId);
  }
});

server.listen(4060, () => {
  console.log("Request lifecycle demo on http://localhost:4060/transform");
});
