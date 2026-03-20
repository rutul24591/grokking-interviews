function percentile(values: number[], p: number) {
  const sorted = [...values].sort((a, b) => a - b);
  const idx = Math.ceil((p / 100) * sorted.length) - 1;
  return sorted[Math.max(0, Math.min(sorted.length - 1, idx))]!;
}

const latenciesMs = [80, 90, 95, 100, 105, 110, 115, 140, 220, 260, 420];
const targetP95 = 250;

const p95 = percentile(latenciesMs, 95);
const p99 = percentile(latenciesMs, 99);

console.log(JSON.stringify({ p95, p99, targetP95, within: p95 <= targetP95 }, null, 2));

