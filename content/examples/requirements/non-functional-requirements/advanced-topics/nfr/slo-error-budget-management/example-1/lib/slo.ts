export function clamp01(v: number) {
  if (Number.isNaN(v)) return 0;
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

export function budgetSummary(params: { bad: number; total: number; objective: number }) {
  const allowed = allowedBad(params.total, params.objective);
  const remainingBad = allowed - params.bad;
  const remainingPct = allowed === 0 ? 1 : Math.max(0, remainingBad / allowed);
  return {
    allowedBad: allowed,
    remainingBad,
    remainingPct,
    consumedPct: 1 - remainingPct,
  };
}

export function evaluateAlerts(params: {
  burn5m: number;
  burn30m: number;
  burn1h: number;
  burn6h: number;
  remainingBudgetPct: number;
}) {
  const fastThreshold = 14.4;
  const slowThreshold = 6.0;
  const fast = params.burn5m > fastThreshold && params.burn1h > fastThreshold;
  const slow = params.burn30m > slowThreshold && params.burn6h > slowThreshold;
  const releaseFreeze = fast || slow || params.remainingBudgetPct < 0.2;
  return {
    fast: { firing: fast, threshold: fastThreshold, windows: ["5m", "1h"] as const },
    slow: { firing: slow, threshold: slowThreshold, windows: ["30m", "6h"] as const },
    releaseFreeze,
  };
}

