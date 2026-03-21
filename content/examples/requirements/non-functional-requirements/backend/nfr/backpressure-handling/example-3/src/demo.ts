/**
 * Adaptive concurrency control (concept):
 * - measure latency / queueing
 * - reduce concurrency when p95 increases
 * - increase slowly when healthy
 */

function adjust(concurrency: number, p95: number, target: number) {
  if (p95 > target * 1.2) return Math.max(1, concurrency - 1);
  if (p95 < target * 0.9) return concurrency + 1;
  return concurrency;
}

const series = [180, 190, 260, 310, 220, 180];
let c = 4;
const out = series.map((p95) => {
  c = adjust(c, p95, 200);
  return { p95, concurrency: c };
});

console.log(JSON.stringify({ out }, null, 2));

