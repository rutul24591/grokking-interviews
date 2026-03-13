function tumble(events, windowSize) {
  const buckets = {};
  for (const e of events) {
    const w = Math.floor(e.ts / windowSize);
    buckets[w] = (buckets[w] || 0) + 1;
  }
  return buckets;
}
module.exports = { tumble };