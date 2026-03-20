function normal(mu: number, sigma: number) {
  let u = 0;
  let v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  return mu + sigma * z;
}

export function simulateLatencySamples(params: { n: number; p50: number; jitter: number; tail: number }) {
  const { n, p50, jitter, tail } = params;
  const out: number[] = [];
  for (let i = 0; i < n; i += 1) {
    const base = Math.max(1, normal(p50, jitter));
    const withTail = Math.random() < 0.05 ? base + tail * Math.random() : base;
    out.push(withTail);
  }
  return out;
}

