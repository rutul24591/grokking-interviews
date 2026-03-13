function route(path) {
  if (path.startsWith('/v2')) return 'new-service';
  return 'legacy';
}
module.exports = { route };