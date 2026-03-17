function reduce(pairs) {
  const out = {};
  for (const [w, c] of pairs) out[w] = (out[w] || 0) + c;
  return out;
}
module.exports = { reduce };