export function percentile(values: number[], q: number) {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const idx = Math.floor(q * (sorted.length - 1));
  return sorted[Math.max(0, Math.min(sorted.length - 1, idx))];
}

function sampleWithReplacement(values: number[], n: number) {
  const out: number[] = [];
  for (let i = 0; i < n; i += 1) {
    out.push(values[Math.floor(Math.random() * values.length)]);
  }
  return out;
}

export function bootstrapDeltaP95(params: { baseline: number[]; canary: number[]; iters: number }) {
  const { baseline, canary, iters } = params;
  const n0 = baseline.length;
  const n1 = canary.length;
  const deltas: number[] = [];
  for (let i = 0; i < iters; i += 1) {
    const b = sampleWithReplacement(baseline, n0);
    const c = sampleWithReplacement(canary, n1);
    const db = percentile(b, 0.95);
    const dc = percentile(c, 0.95);
    deltas.push(dc - db);
  }
  deltas.sort((a, b) => a - b);
  const ciLow = percentile(deltas, 0.025);
  const ciHigh = percentile(deltas, 0.975);
  const median = percentile(deltas, 0.5);
  const probPositive = deltas.filter((d) => d > 0).length / deltas.length;
  return { median, ciLow, ciHigh, probPositive };
}

