const buckets = new Map();
const WINDOW_MS = 1000;
const MAX_REQ = 5;

export function allowRequest(key) {
  const now = Date.now();
  const bucket = buckets.get(key) || { count: 0, start: now };
  if (now - bucket.start > WINDOW_MS) {
    bucket.count = 0;
    bucket.start = now;
  }
  bucket.count += 1;
  buckets.set(key, bucket);
  return bucket.count <= MAX_REQ;
}