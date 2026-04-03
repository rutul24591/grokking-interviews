function chooseLocalSearchPlan(scenario) {
  const plan = {
    id: scenario.id,
    useWorker: scenario.datasetSize > 25000 || scenario.latencyMs > 50,
    rankingMode: scenario.fuzzyTolerance === "high" ? "shallow-fuzzy-ranking" : scenario.rankingMode,
    fallback: scenario.staleIndex ? "reindex-before-trust" : "serve-local-results",
    actions: []
  };

  if (plan.useWorker) plan.actions.push("offload-indexing");
  if (scenario.staleIndex) plan.actions.push("show-reindex-banner");
  if (scenario.renderCostHigh) plan.actions.push("disable-inline-highlights");
  return plan;
}

const scenarios = [
  { id: "small", datasetSize: 4800, latencyMs: 14, fuzzyTolerance: "low", rankingMode: "field-weighted", staleIndex: false, renderCostHigh: false },
  { id: "mid", datasetSize: 12000, latencyMs: 38, fuzzyTolerance: "medium", rankingMode: "title-first", staleIndex: false, renderCostHigh: true },
  { id: "large", datasetSize: 55000, latencyMs: 180, fuzzyTolerance: "high", rankingMode: "recency-boosted", staleIndex: true, renderCostHigh: true }
];

const plans = scenarios.map(chooseLocalSearchPlan);
console.log(plans);
console.log({ workerPaths: plans.filter((item) => item.useWorker).length, highlightReductions: plans.filter((item) => item.actions.includes("disable-inline-highlights")).length });
