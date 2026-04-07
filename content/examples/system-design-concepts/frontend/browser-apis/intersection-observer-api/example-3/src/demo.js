function detectViewportTriggerRisk(state) {
  const blockers = [];
  if (state.callbackFlooding) blockers.push("observer-callback-flooding-main-thread");
  if (state.falseImpressionLogged) blockers.push("impression-fired-without-dwell");
  if (state.anchorDriftVisible && !state.anchorRecoveryVisible) blockers.push("anchor-drift-without-recovery");
  if (!state.prefetchBudgetVisible) blockers.push("prefetch-budget-hidden");
  return { id: state.id, healthy: blockers.length === 0, blockers, repair: blockers[0] ?? "healthy" };
}

const states = [
  { id: "healthy", callbackFlooding: false, falseImpressionLogged: false, anchorDriftVisible: false, anchorRecoveryVisible: true, prefetchBudgetVisible: true },
  { id: "broken", callbackFlooding: true, falseImpressionLogged: true, anchorDriftVisible: true, anchorRecoveryVisible: false, prefetchBudgetVisible: false }
];

console.log(states.map(detectViewportTriggerRisk));
