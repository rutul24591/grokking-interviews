import { bootstrapDelta, percentile } from "./bootstrap";
import { simulateLatencySamples } from "./simulate";

const baseline = simulateLatencySamples({ n: 400, p50: 80, jitter: 12, tail: 350 });
const mildRegression = simulateLatencySamples({ n: 400, p50: 95, jitter: 12, tail: 350 });
const noisySmallWindow = simulateLatencySamples({ n: 40, p50: 95, jitter: 30, tail: 500 });

function p95(values: number[]) {
  return percentile(values, 0.95);
}

const mild = bootstrapDelta({ baseline, experiment: mildRegression, iters: 2000, statistic: p95 });
const noisy = bootstrapDelta({ baseline: baseline.slice(0, 40), experiment: noisySmallWindow, iters: 2000, statistic: p95 });

console.log(
  JSON.stringify(
    {
      baseline: { n: baseline.length, p95: p95(baseline) },
      experiment: { n: mildRegression.length, p95: p95(mildRegression) },
      bootstrap: mild,
      interpretation:
        "If probPositive is high and CI is mostly > 0, the p95 regression is likely real. Otherwise it may be noise.",
    },
    null,
    2,
  ),
);

console.log(
  JSON.stringify(
    {
      baseline_small_window: { n: 40, p95: p95(baseline.slice(0, 40)) },
      experiment_small_window: { n: noisySmallWindow.length, p95: p95(noisySmallWindow) },
      bootstrap: noisy,
      interpretation:
        "Small windows increase variance; you can get misleading conclusions. Extend duration or increase sample rate.",
    },
    null,
    2,
  ),
);

