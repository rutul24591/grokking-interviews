export const historyScenarios = [
  {
    id: "research-user",
    label: "Research user",
    queries: ["load balancing", "retry mechanisms", "autoscaling"],
    retentionDays: 30,
    pinnedQueries: 1,
    privateMode: false,
    dedupeState: "healthy",
    reuseRate: "42% reused in autocomplete",
    storageMode: "persistent-local-history",
    reviewAction: "Keep history visible because reuse materially improves research velocity.",
    riskNotes: ["shared laptop", "long-lived local history"]
  },
  {
    id: "heavy-searcher",
    label: "Heavy searcher",
    queries: ["webrtc", "websocket", "server sent events", "presence"],
    retentionDays: 14,
    pinnedQueries: 2,
    privateMode: false,
    dedupeState: "overfull",
    reuseRate: "68% reused in autocomplete",
    storageMode: "persistent-local-history",
    reviewAction: "Trim and normalize aggressively before the suggestion rail becomes noisy.",
    riskNotes: ["duplicate aliases", "capacity pressure"]
  },
  {
    id: "private-session",
    label: "Private session",
    queries: ["salary banding", "internal incident"],
    retentionDays: 0,
    pinnedQueries: 0,
    privateMode: true,
    dedupeState: "leaking",
    reuseRate: "0% persisted by policy",
    storageMode: "memory-only-session",
    reviewAction: "Disable disk persistence and suppress suggestion reuse when the session is private.",
    riskNotes: ["sensitive query terms", "shared machine risk"]
  }
] as const;

export const historyPolicies = [
  "Normalize and deduplicate repeated searches so recent history stays useful.",
  "Respect private or sensitive sessions by suppressing persistent storage entirely.",
  "Keep recency ordering explicit when pinned searches coexist with the rolling history list.",
  "Do not replay stale or duplicate history entries into autocomplete without clear provenance."
];

export const historyRecovery = [
  { issue: "History over capacity", action: "Trim the oldest non-pinned queries and preserve only the most relevant recent set." },
  { issue: "Private-mode leakage", action: "Disable persistence and clear any transient history on exit." },
  { issue: "Duplicate pollution", action: "Normalize tokens and merge semantically identical searches into one entry." }
];
