function traceId(req) {
  return req.headers['x-trace-id'] || 'trace-' + Date.now();
}
module.exports = { traceId };