function detectHistoryRisk(state) {
  const blockers = [];
  if (state.privateMode && state.persistedToDisk) blockers.push("private-search-history-leak");
  if (state.duplicateEntriesVisible) blockers.push("duplicate-history-pollution");
  if (state.oldEntriesRetained && !state.trimApplied) blockers.push("history-capacity-not-enforced");
  if (state.sensitiveTermsPresent && state.historyBoostEnabled) blockers.push("sensitive-history-fed-into-autocomplete");
  return {
    id: state.id,
    healthy: blockers.length === 0,
    blockers,
    repair: blockers[0] ?? "healthy",
    escalation: blockers.includes("private-search-history-leak") ? "block-release" : "watch"
  };
}

const states = [
  { id: "healthy", privateMode: false, persistedToDisk: true, duplicateEntriesVisible: false, oldEntriesRetained: false, trimApplied: true, sensitiveTermsPresent: false, historyBoostEnabled: true },
  { id: "broken", privateMode: true, persistedToDisk: true, duplicateEntriesVisible: true, oldEntriesRetained: true, trimApplied: false, sensitiveTermsPresent: true, historyBoostEnabled: true }
];

console.log(states.map(detectHistoryRisk));
