function detectAutocompleteRisk(state) {
  const blockers = [];
  if (state.staleSuggestionsVisible) blockers.push("stale-suggestions-rendered");
  if (state.keyboardFocusLost) blockers.push("keyboard-focus-drift");
  if (state.historyBoostTooHigh && !state.prefixResultVisible) blockers.push("history-boost-buried-prefix-match");
  if (state.queryTokenChanged && !state.activeOptionReset) blockers.push("active-option-carried-across-query-change");
  return {
    id: state.id,
    healthy: blockers.length === 0,
    blockers,
    repair: blockers[0] ?? "healthy",
    escalation: blockers.length > 1 ? "block-release" : "watch"
  };
}

const states = [
  { id: "healthy", staleSuggestionsVisible: false, keyboardFocusLost: false, historyBoostTooHigh: false, prefixResultVisible: true, queryTokenChanged: false, activeOptionReset: true },
  { id: "broken", staleSuggestionsVisible: true, keyboardFocusLost: true, historyBoostTooHigh: true, prefixResultVisible: false, queryTokenChanged: true, activeOptionReset: false }
];

console.log(states.map(detectAutocompleteRisk));
