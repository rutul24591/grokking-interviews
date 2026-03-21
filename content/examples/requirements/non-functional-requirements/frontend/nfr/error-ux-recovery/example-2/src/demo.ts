function backoffMs(base: number, attempt: number, jitter: number) {
  const exp = base * Math.pow(2, Math.max(0, attempt - 1));
  const j = Math.floor(Math.random() * jitter);
  return exp + j;
}

const series = Array.from({ length: 5 }, (_, i) => backoffMs(100, i + 1, 50));
console.log(JSON.stringify({ series }, null, 2));
console.log(JSON.stringify({ ok: true }, null, 2));

