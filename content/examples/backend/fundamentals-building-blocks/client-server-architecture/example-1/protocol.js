// Shared response helpers and error envelope for the API contract.

function json(res, statusCode, payload) {
  const body = JSON.stringify(payload, null, 2);
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": Buffer.byteLength(body),
  });
  res.end(body);
}

function ok(res, data) {
  json(res, 200, { data });
}

function created(res, data) {
  json(res, 201, { data });
}

function badRequest(res, message, details) {
  json(res, 400, { error: { code: "BAD_REQUEST", message, details } });
}

function notFound(res, message) {
  json(res, 404, { error: { code: "NOT_FOUND", message } });
}

function internalError(res, message) {
  json(res, 500, { error: { code: "INTERNAL", message } });
}

module.exports = {
  ok,
  created,
  badRequest,
  notFound,
  internalError,
};
