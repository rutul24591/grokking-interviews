function detectFacetRisk(state) {
  const blockers = [];
  if (state.contradictoryFacets && !state.conflictHintVisible) blockers.push("contradictory-filters-hidden");
  if (state.resultCount === 0 && !state.resetSuggestionVisible) blockers.push("zero-results-without-recovery");
  if (state.staleCounts && !state.countConfidenceLowered) blockers.push("stale-counts-presented-as-trustworthy");
  if (state.resetSuggestionVisible && !state.activePillsPreserved) blockers.push("recovery-path-drops-filter-context");
  return {
    id: state.id,
    healthy: blockers.length === 0,
    blockers,
    repair: blockers[0] ?? "healthy",
    escalation: blockers.length > 1 ? "block-release" : "watch"
  };
}

const states = [
  { id: "healthy", contradictoryFacets: false, conflictHintVisible: true, resultCount: 12, resetSuggestionVisible: true, staleCounts: false, countConfidenceLowered: true, activePillsPreserved: true },
  { id: "broken", contradictoryFacets: true, conflictHintVisible: false, resultCount: 0, resetSuggestionVisible: false, staleCounts: true, countConfidenceLowered: false, activePillsPreserved: false }
];

console.log(states.map(detectFacetRisk));
