function chooseElasticFrontendPlan(query) {
  const actions = [];
  if (query.shardState !== "green") actions.push("render-partial-results-banner");
  if (query.timeoutMs > 500) actions.push("simplify-query-dsl");
  if (query.highlightMode === "none") actions.push("plain-snippet-fallback");

  return {
    id: query.id,
    requestExplain: query.relevanceState === "healthy",
    fallbackToSimpleQuery: query.shardState !== "green" || query.timeoutMs > 500,
    renderPlainSnippets: query.highlightMode === "none",
    actions
  };
}

const queries = [
  { id: "healthy", relevanceState: "healthy", shardState: "green", timeoutMs: 120, highlightMode: "snippets" },
  { id: "partial", relevanceState: "partial", shardState: "yellow", timeoutMs: 450, highlightMode: "title-only" },
  { id: "degraded", relevanceState: "repair", shardState: "timed-out", timeoutMs: 1200, highlightMode: "none" }
];

const plans = queries.map(chooseElasticFrontendPlan);
console.log(plans);
console.log({ degradedPaths: plans.filter((item) => item.actions.length > 1).map((item) => item.id) });
