function detectE2ERisk(state) {
  const blockers = [];

  if (state.reliesOnFixedSleeps) blockers.push("fixed-waits-can-flake-under-load");
  if (state.sharedAccountAcrossRuns) blockers.push("parallel-e2e-runs-can-corrupt-state");
  if (state.successAssertedBeforeWebhook) blockers.push("journey-can-pass-before-real-completion");
  if (state.bypassUsedForExternalStep) blockers.push("test-path-diverges-from-customer-path");
  if (state.cleanupSkippedAfterFailure) blockers.push("failed-run-can-poison-the-next-e2e-attempt");

  return { id: state.id, healthy: blockers.length === 0, blockers, remediation: blockers.length ? "stabilize-waits-isolate-data-and-remove-bypasses" : "healthy" };
}

const states = [
  { id: "healthy", reliesOnFixedSleeps: false, sharedAccountAcrossRuns: false, successAssertedBeforeWebhook: false, bypassUsedForExternalStep: false, cleanupSkippedAfterFailure: false },
  { id: "fragile", reliesOnFixedSleeps: true, sharedAccountAcrossRuns: true, successAssertedBeforeWebhook: true, bypassUsedForExternalStep: true, cleanupSkippedAfterFailure: true }
];

console.log(states.map(detectE2ERisk));
