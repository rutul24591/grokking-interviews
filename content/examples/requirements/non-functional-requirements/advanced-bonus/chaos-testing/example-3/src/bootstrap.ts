export function mean(values: number[]) {
  if (!values.length) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

export function percentile(values: number[], q: number) {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const idx = Math.floor(q * (sorted.length - 1));
  return sorted[Math.max(0, Math.min(sorted.length - 1, idx))];
}

function sampleWithReplacement(values: number[], n: number) {
  const out: number[] = [];
  for (let i = 0; i < n; i += 1) {
    const idx = Math.floor(Math.random() * values.length);
    out.push(values[idx]);
  }
  return out;
}

export function bootstrapDelta(params: {
  baseline: number[];
  experiment: number[];
  iters: number;
  statistic: (values: number[]) => number;
}) {
  const { baseline, experiment, iters, statistic } = params;
  const n0 = baseline.length;
  const n1 = experiment.length;
  const deltas: number[] = [];

  for (let i = 0; i < iters; i += 1) {
    const b = sampleWithReplacement(baseline, n0);
    const e = sampleWithReplacement(experiment, n1);
    deltas.push(statistic(e) - statistic(b));
  }

  deltas.sort((a, b) => a - b);
  const p = (q: number) => percentile(deltas, q);
  const median = p(0.5);
  const ciLow = p(0.025);
  const ciHigh = p(0.975);
  const probPositive = deltas.filter((d) => d > 0).length / deltas.length;

  return { median, ciLow, ciHigh, probPositive };
}

