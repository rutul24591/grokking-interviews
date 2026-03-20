function backoffMs(attempt: number, baseMs = 50, maxMs = 2000) {
  const exp = Math.min(maxMs, baseMs * 2 ** attempt);
  const jitter = Math.random() * exp * 0.2;
  return Math.round(exp - jitter);
}

const delays = Array.from({ length: 8 }, (_, i) => backoffMs(i));
console.log(JSON.stringify({ delays }, null, 2));

