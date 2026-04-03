function chooseFacetPlan(scenario) {
  const actions = [];
  if (scenario.countMode !== "live-recompute") actions.push("mark-counts-approximate");
  if (scenario.zeroResultRisk) actions.push("show-reset-recommendation");
  if (scenario.contradictoryFacets) actions.push("block-apply-and-explain-conflict");

  return {
    id: scenario.id,
    recomputeCounts: scenario.countMode === "live-recompute",
    suggestReset: scenario.zeroResultRisk,
    blockApply: scenario.contradictoryFacets,
    actions
  };
}

const scenarios = [
  { id: "healthy", countMode: "live-recompute", zeroResultRisk: false, contradictoryFacets: false },
  { id: "narrow", countMode: "partial-recompute", zeroResultRisk: true, contradictoryFacets: false },
  { id: "contradictory", countMode: "stale-counts", zeroResultRisk: true, contradictoryFacets: true }
];

const plans = scenarios.map(chooseFacetPlan);
console.log(plans);
console.log({ blockedStates: plans.filter((item) => item.blockApply).length, approximateCounts: plans.filter((item) => item.actions.includes("mark-counts-approximate")).length });
