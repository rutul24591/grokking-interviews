function getTrace(req) {
  return req.headers['x-trace-id'] || 't-' + Date.now();
}
module.exports = { getTrace };