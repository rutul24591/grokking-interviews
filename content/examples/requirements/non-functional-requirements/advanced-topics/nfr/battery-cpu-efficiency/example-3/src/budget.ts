export function percentile(xs: number[], p: number) {
  if (!xs.length) return 0;
  const sorted = xs.slice().sort((a, b) => a - b);
  const idx = Math.min(sorted.length - 1, Math.floor((sorted.length - 1) * p));
  return sorted[idx];
}

export function gate(params: { durationsMs: number[]; maxCount: number; maxP95Ms: number }) {
  const p95 = percentile(params.durationsMs, 0.95);
  return {
    count: params.durationsMs.length,
    p95,
    ok: params.durationsMs.length <= params.maxCount && p95 <= params.maxP95Ms,
  };
}

