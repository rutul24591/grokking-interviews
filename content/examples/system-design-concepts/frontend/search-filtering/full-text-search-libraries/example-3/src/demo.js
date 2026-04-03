function detectLibraryRisk(state) {
  const blockers = [];
  if (state.falsePositiveRisk && !state.reviewWarningVisible) blockers.push("fuzzy-noise-hidden");
  if (!state.stemming && state.recallClaimedStrong) blockers.push("recall-overstated-without-stemming");
  if (state.highlightMismatch && !state.plainSnippetFallbackVisible) blockers.push("highlight-mismatch-without-fallback");
  if (state.shipCandidate && state.auditOwnersMissing) blockers.push("relevance-rollout-without-owner-signoff");
  return {
    id: state.id,
    healthy: blockers.length === 0,
    blockers,
    repair: blockers[0] ?? "healthy",
    escalation: blockers.includes("relevance-rollout-without-owner-signoff") ? "block-release" : "watch"
  };
}

const states = [
  { id: "healthy", falsePositiveRisk: false, reviewWarningVisible: true, stemming: true, recallClaimedStrong: true, highlightMismatch: false, plainSnippetFallbackVisible: true, shipCandidate: true, auditOwnersMissing: false },
  { id: "broken", falsePositiveRisk: true, reviewWarningVisible: false, stemming: false, recallClaimedStrong: true, highlightMismatch: true, plainSnippetFallbackVisible: false, shipCandidate: true, auditOwnersMissing: true }
];

console.log(states.map(detectLibraryRisk));
