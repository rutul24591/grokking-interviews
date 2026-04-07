function detectMutationLeakRisk(state) {
  const blockers = [];
  if (state.documentScope) blockers.push("document-root-observed");
  if (state.disconnectMissing) blockers.push("observer-never-disconnects");
  if (state.widgetMutationStorm && !state.widgetSandboxed) blockers.push("widget-churn-not-contained");
  if (!state.cleanupVisible) blockers.push("cleanup-path-hidden-from-reviewers");
  return { id: state.id, healthy: blockers.length === 0, blockers, repair: blockers[0] ?? "healthy" };
}

const states = [
  { id: "healthy", documentScope: false, disconnectMissing: false, widgetMutationStorm: false, widgetSandboxed: true, cleanupVisible: true },
  { id: "broken", documentScope: true, disconnectMissing: true, widgetMutationStorm: true, widgetSandboxed: false, cleanupVisible: false }
];

console.log(states.map(detectMutationLeakRisk));
