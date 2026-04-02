export function wilsonInterval(params: { successes: number; trials: number; z: number }) {
  const { successes, trials, z } = params;
  if (trials <= 0) return { low: 0, high: 1, p: 0 };
  const p = successes / trials;
  const z2 = z * z;
  const denom = 1 + z2 / trials;
  const center = (p + z2 / (2 * trials)) / denom;
  const margin =
    (z *
      Math.sqrt((p * (1 - p)) / trials + z2 / (4 * trials * trials))) /
    denom;
  return {
    p,
    low: Math.max(0, center - margin),
    high: Math.min(1, center + margin),
  };
}

export function zForConfidence(confidence: number) {
  // Common approximations: 90% -> 1.645, 95% -> 1.96, 99% -> 2.576
  if (confidence >= 0.99) return 2.576;
  if (confidence >= 0.95) return 1.96;
  if (confidence >= 0.9) return 1.645;
  return 1.28;
}

