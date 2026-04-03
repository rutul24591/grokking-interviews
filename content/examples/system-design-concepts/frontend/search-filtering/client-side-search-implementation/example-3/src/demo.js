function detectLocalSearchRisk(state) {
  const blockers = [];
  if (state.datasetSize > 25000 && !state.workerEnabled) blockers.push("main-thread-search-over-budget");
  if (state.staleIndex && !state.reindexBannerVisible) blockers.push("stale-index-hidden");
  if (state.renderCostHigh && state.highlightsEnabled) blockers.push("highlight-render-jank");
  if (state.workerEnabled && !state.resultsVersionPinned) blockers.push("worker-results-can-race-ui-state");
  return {
    id: state.id,
    healthy: blockers.length === 0,
    blockers,
    repair: blockers[0] ?? "healthy",
    escalation: blockers.length > 1 ? "block-release" : "watch"
  };
}

const states = [
  { id: "healthy", datasetSize: 8000, workerEnabled: false, staleIndex: false, reindexBannerVisible: true, renderCostHigh: false, highlightsEnabled: true, resultsVersionPinned: true },
  { id: "broken", datasetSize: 55000, workerEnabled: true, staleIndex: true, reindexBannerVisible: false, renderCostHigh: true, highlightsEnabled: true, resultsVersionPinned: false }
];

console.log(states.map(detectLocalSearchRisk));
