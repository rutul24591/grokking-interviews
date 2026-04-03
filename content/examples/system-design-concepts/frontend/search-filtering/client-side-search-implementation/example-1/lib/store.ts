export const localSearchScenarios = [
  {
    id: "article-catalog",
    label: "Article catalog",
    query: "load balancing",
    datasetSize: 4800,
    indexMode: "token-map",
    fuzzyTolerance: "low",
    rankingMode: "field-weighted",
    latencyMs: 14,
    staleIndex: false
  },
  {
    id: "api-reference",
    label: "API reference",
    query: "cache invalidation",
    datasetSize: 12000,
    indexMode: "trigram",
    fuzzyTolerance: "medium",
    rankingMode: "title-first",
    latencyMs: 38,
    staleIndex: false
  },
  {
    id: "oversized-memory",
    label: "Oversized in-memory set",
    query: "transaction",
    datasetSize: 55000,
    indexMode: "linear-scan",
    fuzzyTolerance: "high",
    rankingMode: "recency-boosted",
    latencyMs: 180,
    staleIndex: true
  }
] as const;

export const localSearchPolicies = [
  "Keep query evaluation on the client only while the dataset stays within a defensible memory and CPU budget.",
  "Separate indexing strategy from ranking strategy so slow search paths are diagnosable.",
  "Expose stale-index state explicitly when locally cached results no longer match the source data.",
  "Fallback to server-backed search before the main thread becomes the bottleneck."
];

export const localSearchRecovery = [
  { issue: "Dataset too large", action: "Switch to remote search or pre-computed shards before local search blocks input." },
  { issue: "Stale local index", action: "Show reindex status and suppress confidence indicators until refresh completes." },
  { issue: "Linear scan path", action: "Promote a token index or worker-backed search path instead of scanning on every keystroke." }
];
