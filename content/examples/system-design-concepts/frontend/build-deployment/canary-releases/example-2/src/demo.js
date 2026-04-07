function evaluateCanaryExpansion(candidate) {
  const actions = [];

  if (!candidate.segmentMetricsReady) actions.push("split-metrics-by-segment");
  if (candidate.errorBudgetBurnPct > 30 || candidate.conversionDropPct >= 1.5) actions.push("pause-expansion");
  if (!candidate.killSwitchReady) actions.push("restore-kill-switch");
  if (candidate.unrepresentativeCohort) actions.push("re-sample-canary-cohort");

  return {
    id: candidate.id,
    decision: actions.length === 0 ? "expand-canary" : "hold-canary",
    actions,
    ready: actions.length === 0
  };
}

const candidates = [
  { id: "pricing", segmentMetricsReady: true, errorBudgetBurnPct: 9, conversionDropPct: 0.2, killSwitchReady: true, unrepresentativeCohort: false },
  { id: "mobile-nav", segmentMetricsReady: false, errorBudgetBurnPct: 12, conversionDropPct: 0.3, killSwitchReady: true, unrepresentativeCohort: true },
  { id: "checkout", segmentMetricsReady: true, errorBudgetBurnPct: 47, conversionDropPct: 2.4, killSwitchReady: false, unrepresentativeCohort: false }
];

console.log(candidates.map(evaluateCanaryExpansion));
