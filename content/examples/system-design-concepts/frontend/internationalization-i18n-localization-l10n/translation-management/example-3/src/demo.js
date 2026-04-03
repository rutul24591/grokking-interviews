function detectTranslationRuntimeGap({ keyStatus, hasFallback, isCriticalCta, ownerKnown }) {
  return {
    blockRender: keyStatus === "missing" && isCriticalCta && !hasFallback,
    showFallback: keyStatus === "missing" && hasFallback,
    logOwnershipAlert: keyStatus !== "approved" || !ownerKnown,
    escalation: !ownerKnown ? "missing-owner" : keyStatus === "review" ? "await-review" : "none"
  };
}

console.log([
  { keyStatus: "missing", hasFallback: true, isCriticalCta: true, ownerKnown: true },
  { keyStatus: "review", hasFallback: false, isCriticalCta: false, ownerKnown: false },
  { keyStatus: "approved", hasFallback: false, isCriticalCta: true, ownerKnown: true }
].map(detectTranslationRuntimeGap));
