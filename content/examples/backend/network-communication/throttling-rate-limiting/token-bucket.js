const buckets = new Map();
const RATE = 5;
const CAPACITY = 10;

export function allow(key) {
  const now = Date.now();
  const bucket = buckets.get(key) || { tokens: CAPACITY, last: now };
  const delta = now - bucket.last;
  const refill = Math.floor((delta / 1000) * RATE);
  bucket.tokens = Math.min(CAPACITY, bucket.tokens + refill);
  bucket.last = now;
  if (bucket.tokens <= 0) {
    buckets.set(key, bucket);
    return false;
  }
  bucket.tokens -= 1;
  buckets.set(key, bucket);
  return true;
}