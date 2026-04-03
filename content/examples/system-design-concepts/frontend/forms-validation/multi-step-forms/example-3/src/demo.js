function invalidateSummary({ reviewedAtVersion, currentVersion, changedSteps, skippedSteps }) {
  return {
    needsReview: reviewedAtVersion !== currentVersion || changedSteps.length > 0 || skippedSteps.length > 0,
    changedSteps,
    skippedSteps,
    action: skippedSteps.length > 0 ? "replay-skipped-step" : changedSteps.includes("workspace") ? "return-to-step-1" : "reopen-confirmation"
  };
}

console.log([
  { reviewedAtVersion: "v4", currentVersion: "v5", changedSteps: ["workspace"], skippedSteps: [] },
  { reviewedAtVersion: "v8", currentVersion: "v8", changedSteps: [], skippedSteps: ["reviewers"] }
].map(invalidateSummary));
