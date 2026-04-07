function detectIntegrationRisk(state) {
  const blockers = [];

  if (state.contractVersionDrift) blockers.push("preview-and-release-contracts-do-not-match");
  if (state.callbackCanArriveLate && !state.callbackAssertionsPresent) blockers.push("late-callback-state-not-verified");
  if (state.sharedTestDataPolluted) blockers.push("parallel-runs-can-corrupt-integration-results");
  if (state.authRefreshSkipped) blockers.push("session-refresh-failure-hidden-from-suite");
  if (state.oneServiceCanReturnStaleData && !state.staleStateAssertionsPresent) blockers.push("stale-dependent-state-can-slip-through-suite");

  return { id: state.id, healthy: blockers.length === 0, blockers, remediation: blockers.length ? "block-release-and-fix-boundary-evidence" : "healthy" };
}

const states = [
  { id: "healthy", contractVersionDrift: false, callbackCanArriveLate: true, callbackAssertionsPresent: true, sharedTestDataPolluted: false, authRefreshSkipped: false, oneServiceCanReturnStaleData: true, staleStateAssertionsPresent: true },
  { id: "fragile", contractVersionDrift: true, callbackCanArriveLate: true, callbackAssertionsPresent: false, sharedTestDataPolluted: true, authRefreshSkipped: true, oneServiceCanReturnStaleData: true, staleStateAssertionsPresent: false }
];

console.log(states.map(detectIntegrationRisk));
