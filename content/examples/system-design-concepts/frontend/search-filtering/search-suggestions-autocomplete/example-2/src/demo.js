function chooseAutocompletePlan(scenario) {
  const actions = [];
  if (scenario.keyboardState === "repair") actions.push("repair-active-option-state");
  if (scenario.rankingMode === "history-heavy") actions.push("lower-history-boost");
  if (scenario.staleSuggestionRisk) actions.push("gate-render-by-query-token");
  if (scenario.queryLength < 2) actions.push("delay-network-suggestions");

  return {
    id: scenario.id,
    requireKeyboardState: scenario.keyboardState !== "repair",
    reduceHistoryWeight: scenario.rankingMode === "history-heavy",
    dropStaleSuggestions: scenario.staleSuggestionRisk,
    actions
  };
}

const scenarios = [
  { id: "healthy", keyboardState: "stable", rankingMode: "prefix+history", staleSuggestionRisk: false, queryLength: 4 },
  { id: "slow", keyboardState: "lagging", rankingMode: "prefix-only", staleSuggestionRisk: true, queryLength: 3 },
  { id: "broken", keyboardState: "repair", rankingMode: "history-heavy", staleSuggestionRisk: true, queryLength: 1 }
];

const plans = scenarios.map(chooseAutocompletePlan);
console.log(plans);
console.log({ keyboardRepairs: plans.filter((item) => item.actions.includes("repair-active-option-state")).length, delayedNetworkPaths: plans.filter((item) => item.actions.includes("delay-network-suggestions")).map((item) => item.id) });
