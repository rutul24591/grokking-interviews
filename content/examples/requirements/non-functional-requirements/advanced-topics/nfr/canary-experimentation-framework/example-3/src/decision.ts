import { wilsonInterval, zForConfidence } from "./wilson";
import { bootstrapDeltaP95, percentile } from "./bootstrap";

export type Inputs = {
  baseline: { total: number; errors: number; latenciesMs: number[] };
  canary: { total: number; errors: number; latenciesMs: number[] };
  policy: {
    confidence: number;
    maxErrorRateDelta: number;
    maxP95DeltaMs: number;
    minCanaryRequests: number;
  };
};

export function decide(inputs: Inputs) {
  const z = zForConfidence(inputs.policy.confidence);

  const baseOk = inputs.baseline.total - inputs.baseline.errors;
  const canOk = inputs.canary.total - inputs.canary.errors;

  const baseErr = wilsonInterval({ successes: inputs.baseline.errors, trials: inputs.baseline.total, z });
  const canErr = wilsonInterval({ successes: inputs.canary.errors, trials: inputs.canary.total, z });

  const baseErrRate = inputs.baseline.total === 0 ? 0 : inputs.baseline.errors / inputs.baseline.total;
  const canErrRate = inputs.canary.total === 0 ? 0 : inputs.canary.errors / inputs.canary.total;
  const errDelta = canErrRate - baseErrRate;

  const baseP95 = percentile(inputs.baseline.latenciesMs, 0.95);
  const canP95 = percentile(inputs.canary.latenciesMs, 0.95);
  const p95Delta = canP95 - baseP95;

  const boot = bootstrapDeltaP95({
    baseline: inputs.baseline.latenciesMs,
    canary: inputs.canary.latenciesMs,
    iters: 2000,
  });

  const reasons: string[] = [];
  if (inputs.canary.total < inputs.policy.minCanaryRequests) {
    reasons.push(`insufficient_canary_traffic:${inputs.canary.total}<${inputs.policy.minCanaryRequests}`);
    return { decision: "hold" as const, reasons, stats: { baseOk, canOk, baseErr, canErr, errDelta, baseP95, canP95, p95Delta, boot } };
  }

  // Conservative rollback if either metric is confidently worse beyond policy thresholds.
  const errWorse = errDelta > inputs.policy.maxErrorRateDelta && canErr.low > baseErr.high;
  const p95Worse = p95Delta > inputs.policy.maxP95DeltaMs && boot.ciLow > inputs.policy.maxP95DeltaMs;

  if (errWorse) reasons.push("canary_error_rate_regressed_confidently");
  if (p95Worse) reasons.push("canary_p95_regressed_confidently");
  if (reasons.length) {
    return { decision: "rollback" as const, reasons, stats: { baseOk, canOk, baseErr, canErr, errDelta, baseP95, canP95, p95Delta, boot } };
  }

  // Promote if deltas look safe and confidence suggests no regression.
  const safeErr = errDelta <= inputs.policy.maxErrorRateDelta && canErr.high <= baseErr.high + inputs.policy.maxErrorRateDelta;
  const safeP95 = p95Delta <= inputs.policy.maxP95DeltaMs && boot.ciHigh <= inputs.policy.maxP95DeltaMs;
  if (safeErr && safeP95) {
    return { decision: "promote" as const, reasons: ["guardrails_passed_with_confidence"], stats: { baseOk, canOk, baseErr, canErr, errDelta, baseP95, canP95, p95Delta, boot } };
  }

  return { decision: "hold" as const, reasons: ["inconclusive"], stats: { baseOk, canOk, baseErr, canErr, errDelta, baseP95, canP95, p95Delta, boot } };
}

