export function clamp01(v: number) {
  return Math.max(0, Math.min(1, v));
}

export function allowedBad(total: number, objective: number) {
  const budgetFraction = clamp01(1 - objective);
  return total * budgetFraction;
}

export function burnRate(params: { bad: number; total: number; objective: number }) {
  const allowed = allowedBad(params.total, params.objective);
  if (allowed === 0) return params.bad > 0 ? Number.POSITIVE_INFINITY : 0;
  return params.bad / allowed;
}

export function evaluateMultiWindow(params: {
  burn5m: number;
  burn1h: number;
  burn30m: number;
  burn6h: number;
}) {
  const fastThreshold = 14.4;
  const slowThreshold = 6.0;
  return {
    fast: params.burn5m > fastThreshold && params.burn1h > fastThreshold,
    slow: params.burn30m > slowThreshold && params.burn6h > slowThreshold,
    thresholds: { fastThreshold, slowThreshold },
  };
}

