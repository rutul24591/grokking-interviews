export const elasticQueries = [
  {
    id: "docs-search",
    label: "Documentation search",
    query: "circuit breaker",
    resultCount: 48,
    highlightMode: "snippets",
    relevanceState: "healthy",
    timeoutMs: 120,
    shardState: "green"
  },
  {
    id: "catalog-search",
    label: "Catalog search",
    query: "distributed tracing",
    resultCount: 14,
    highlightMode: "title-only",
    relevanceState: "partial",
    timeoutMs: 450,
    shardState: "yellow"
  },
  {
    id: "degraded-search",
    label: "Degraded search",
    query: "leader election",
    resultCount: 0,
    highlightMode: "none",
    relevanceState: "repair",
    timeoutMs: 1200,
    shardState: "timed-out"
  }
] as const;

export const elasticPolicies = [
  "Show relevance confidence and backend health together so empty states are interpretable.",
  "Keep frontend query shaping explicit when highlights, filters, or fallback ranking differ by surface.",
  "Surface timeout and shard degradation before collapsing into a misleading no-results state.",
  "Provide a deterministic fallback when highlight data or explain metadata is missing."
];

export const elasticRecovery = [
  { issue: "Shard timeout", action: "Mark the result set as partial and offer retry before claiming no matches exist." },
  { issue: "Missing highlights", action: "Render plain result snippets and lower confidence messaging." },
  { issue: "Query mismatch", action: "Fallback to simpler match queries until mapping drift is corrected." }
];
