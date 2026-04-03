export const facetScenarios = [
  {
    id: "catalog-browse",
    label: "Catalog browse",
    activeFacets: ["topic:frontend", "level:staff"],
    resultCount: 128,
    countMode: "live-recompute",
    zeroResultRisk: false,
    contradictoryFacets: false
  },
  {
    id: "narrowed-search",
    label: "Narrowed search",
    activeFacets: ["topic:backend", "format:video", "region:eu"],
    resultCount: 7,
    countMode: "partial-recompute",
    zeroResultRisk: true,
    contradictoryFacets: false
  },
  {
    id: "contradictory-filters",
    label: "Contradictory filters",
    activeFacets: ["status:archived", "status:live"],
    resultCount: 0,
    countMode: "stale-counts",
    zeroResultRisk: true,
    contradictoryFacets: true
  }
] as const;

export const facetPolicies = [
  "Recompute counts against the remaining filter space so users can predict the next narrowing step.",
  "Render active filter pills and reset paths prominently when the result space becomes too small.",
  "Detect contradictory filters before showing a dead-end zero-result screen.",
  "Treat stale facet counts as a degradation state, not normal behavior."
];

export const facetRecovery = [
  { issue: "Contradictory filters", action: "Suggest the specific filter pair causing the dead end and offer one-click removal." },
  { issue: "Stale counts", action: "Lower confidence in the side rail and refetch facet counts before applying another filter." },
  { issue: "Zero results", action: "Preserve user intent while recommending the least destructive facet to remove." }
];
