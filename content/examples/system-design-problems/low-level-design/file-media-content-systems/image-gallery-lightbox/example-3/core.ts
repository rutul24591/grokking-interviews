export type ImageGalleryLightboxRecoveryInput = {
  operationId: string;
  committedRevision: number;
  observedRevision: number;
  pressure: string;
  retryBudget: number;
};

export type ImageGalleryLightboxRecoveryPlan = {
  disposition: "retry" | "degrade" | "manual-review";
  repair: string;
  evidence: string[];
  nextRetryBudget: number;
};

// Recovery is explicit so a UI does not silently corrupt the lightbox projection.
export function planImageGalleryLightboxRecovery(
  input: ImageGalleryLightboxRecoveryInput,
): ImageGalleryLightboxRecoveryPlan {
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
    repair: "ignore the stale decode generation, retain the current index, and continue prefetching adjacent assets",
    evidence,
    nextRetryBudget: input.retryBudget - 1,
  };
}

export function runImageGalleryLightboxRecoveryScenario() {
  return planImageGalleryLightboxRecovery({
    operationId: "image-gallery-lightbox-edge-42",
    committedRevision: 12,
    observedRevision: 9,
    pressure: "a slow decode completed after the user navigated twice",
    retryBudget: 2,
  });
}
