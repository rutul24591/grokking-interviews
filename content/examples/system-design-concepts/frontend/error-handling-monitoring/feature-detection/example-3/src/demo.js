function featureDecision(capabilityCheck, userAgentClaim, fallbackId) {
  if (capabilityCheck) {
    return { mode: "use-feature", reason: "runtime-capability-pass" };
  }

  return {
    mode: "fallback",
    reason: userAgentClaim ? "ua-claim-ignored-runtime-failed" : "runtime-capability-failed",
    fallbackId
  };
}

console.log(featureDecision(false, true, "manual-pagination"));
