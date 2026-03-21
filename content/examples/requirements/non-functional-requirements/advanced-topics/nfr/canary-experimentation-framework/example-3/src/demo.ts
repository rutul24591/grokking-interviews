import { decide, type Inputs } from "./decision";

function simulateLatencies(n: number, p50: number, jitter: number, tail: number) {
  const out: number[] = [];
  for (let i = 0; i < n; i += 1) {
    const base = p50 + Math.random() * jitter;
    const withTail = Math.random() < 0.05 ? base + Math.random() * tail : base;
    out.push(withTail);
  }
  return out;
}

const inputs: Inputs = {
  baseline: {
    total: 200_000,
    errors: 350,
    latenciesMs: simulateLatencies(2000, 80, 20, 300),
  },
  canary: {
    total: 20_000,
    errors: 80,
    latenciesMs: simulateLatencies(2000, 95, 25, 450),
  },
  policy: {
    confidence: 0.95,
    maxErrorRateDelta: 0.01,
    maxP95DeltaMs: 80,
    minCanaryRequests: 5000,
  },
};

const result = decide(inputs);
console.log(JSON.stringify({ inputs, result }, null, 2));

