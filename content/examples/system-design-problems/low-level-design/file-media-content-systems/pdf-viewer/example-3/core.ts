export type PdfViewerRecoveryInput = {
  operationId: string;
  committedRevision: number;
  observedRevision: number;
  pressure: string;
  retryBudget: number;
};

export type PdfViewerRecoveryPlan = {
  disposition: "retry" | "degrade" | "manual-review";
  repair: string;
  evidence: string[];
  nextRetryBudget: number;
};

// Recovery is explicit so a UI does not silently corrupt the document viewport.
export function planPdfViewerRecovery(
  input: PdfViewerRecoveryInput,
): PdfViewerRecoveryPlan {
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
    repair: "cancel stale render tasks, keep text-layer selection anchors, and prioritize the new visible window",
    evidence,
    nextRetryBudget: input.retryBudget - 1,
  };
}

export function runPdfViewerRecoveryScenario() {
  return planPdfViewerRecovery({
    operationId: "pdf-viewer-edge-42",
    committedRevision: 12,
    observedRevision: 9,
    pressure: "rapid scrolling left expensive renders queued for off-screen pages",
    retryBudget: 2,
  });
}
