function releaseEligibility(entry) {
  return {
    canPublish: entry.readiness === "ready" || entry.readiness === "warning",
    reason: entry.readiness === "blocked" ? "editorial-blocker" : entry.readiness === "warning" ? "manual-review-recommended" : "ready",
    requiresManualCheck: entry.readiness === "warning" || entry.assetDrift
  };
}

console.log(releaseEligibility({ readiness: "warning", assetDrift: true }));
