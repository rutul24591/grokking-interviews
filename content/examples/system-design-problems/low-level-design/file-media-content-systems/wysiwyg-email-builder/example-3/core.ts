export type WysiwygEmailBuilderRecoveryInput = {
  operationId: string;
  committedRevision: number;
  observedRevision: number;
  pressure: string;
  retryBudget: number;
};

export type WysiwygEmailBuilderRecoveryPlan = {
  disposition: "retry" | "degrade" | "manual-review";
  repair: string;
  evidence: string[];
  nextRetryBudget: number;
};

// Recovery is explicit so a UI does not silently corrupt the email design document.
export function planWysiwygEmailBuilderRecovery(
  input: WysiwygEmailBuilderRecoveryInput,
): WysiwygEmailBuilderRecoveryPlan {
  const evidence = [
    `operation:${input.operationId}`,
    `committed:${input.committedRevision}`,
    `observed:${input.observedRevision}`,
    `pressure:${input.pressure}`,
  ];
  if (input.retryBudget <= 0) {
    return {
      disposition: "manual-review",
      repair: "preserve the last committed projection and surface an actionable recovery state",
      evidence,
      nextRetryBudget: 0,
    };
  }
  return {
    disposition: input.observedRevision < input.committedRevision ? "degrade" : "retry",
    repair: "replace the unsupported block with a table-based fallback, preserve the design revision, and rerun client validation",
    evidence,
    nextRetryBudget: input.retryBudget - 1,
  };
}

export function runWysiwygEmailBuilderRecoveryScenario() {
  return planWysiwygEmailBuilderRecovery({
    operationId: "wysiwyg-email-builder-edge-42",
    committedRevision: 12,
    observedRevision: 9,
    pressure: "the compiled template used unsupported layout behavior in an older mail client",
    retryBudget: 2,
  });
}
