function detectElasticRisk(state) {
  const blockers = [];
  if (state.shardState === "timed-out" && !state.partialResultsBannerVisible) blockers.push("timeout-hidden-as-empty-state");
  if (state.highlightMissing && !state.plainSnippetFallbackVisible) blockers.push("missing-highlight-fallback");
  if (state.mappingDrift && !state.simpleQueryFallbackEnabled) blockers.push("mapping-drift-without-fallback");
  if (state.retryQueued && !state.queryContextPreserved) blockers.push("retry-drops-user-filter-context");
  return {
    id: state.id,
    healthy: blockers.length === 0,
    blockers,
    repair: blockers[0] ?? "healthy",
    escalation: blockers.includes("mapping-drift-without-fallback") ? "block-release" : "watch"
  };
}

const states = [
  { id: "healthy", shardState: "green", partialResultsBannerVisible: true, highlightMissing: false, plainSnippetFallbackVisible: true, mappingDrift: false, simpleQueryFallbackEnabled: true, retryQueued: false, queryContextPreserved: true },
  { id: "broken", shardState: "timed-out", partialResultsBannerVisible: false, highlightMissing: true, plainSnippetFallbackVisible: false, mappingDrift: true, simpleQueryFallbackEnabled: false, retryQueued: true, queryContextPreserved: false }
];

console.log(states.map(detectElasticRisk));
