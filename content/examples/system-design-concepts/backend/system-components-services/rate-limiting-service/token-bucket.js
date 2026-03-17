const buckets = new Map();
function allow(key, limit) {
  const now = Date.now();
  const b = buckets.get(key) || { tokens: limit, ts: now };
  const elapsed = (now - b.ts) / 1000;
  b.tokens = Math.min(limit, b.tokens + elapsed * limit);
  b.ts = now;
  if (b.tokens < 1) { buckets.set(key, b); return false; }
  b.tokens -= 1; buckets.set(key, b); return true;
}
module.exports = { allow };