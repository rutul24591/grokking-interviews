// Time-bucketed metric store with retention.

const buckets = new Map();
const retentionMs = 1000 * 60 * 60; // 1 hour

function bucketKey(ts) {
  const date = new Date(ts);
  date.setMinutes(0, 0, 0);
  return date.toISOString();
}

function writeMetric(name, value, ts = Date.now()) {
  const key = bucketKey(ts);
  if (!buckets.has(key)) buckets.set(key, []);
  buckets.get(key).push({ name, value, ts });
}

function queryRange(start, end) {
  const results = [];
  for (const [key, entries] of buckets.entries()) {
    const bucketTime = new Date(key).getTime();
    if (bucketTime >= start && bucketTime <= end) {
      results.push(...entries);
    }
  }
  return results;
}

function enforceRetention(now = Date.now()) {
  for (const key of buckets.keys()) {
    const bucketTime = new Date(key).getTime();
    if (now - bucketTime > retentionMs) {
      buckets.delete(key);
    }
  }
}

module.exports = { writeMetric, queryRange, enforceRetention };
