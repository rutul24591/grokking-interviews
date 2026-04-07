function detectCanaryFailure(state) {
  const blockers = [];

  if (state.segmentRegression && !state.segmentRollbackReady) blockers.push("no-segment-specific-rollback");
  if (state.globalRegression && state.currentWeight > 0) blockers.push("failed-canary-still-serving-users");
  if (state.autoExpandEnabled && !state.stopConditionWired) blockers.push("automation-can-expand-without-guardrails");
  if (state.observabilityLagSeconds > 60) blockers.push("signals-arrive-too-late-for-safe-canary-decisions");

  return { id: state.id, healthy: blockers.length === 0, blockers };
}

const states = [
  { id: "healthy", segmentRegression: false, segmentRollbackReady: true, globalRegression: false, currentWeight: 10, autoExpandEnabled: false, stopConditionWired: true, observabilityLagSeconds: 10 },
  { id: "unsafe", segmentRegression: true, segmentRollbackReady: false, globalRegression: true, currentWeight: 25, autoExpandEnabled: true, stopConditionWired: false, observabilityLagSeconds: 120 }
];

console.log(states.map(detectCanaryFailure));
