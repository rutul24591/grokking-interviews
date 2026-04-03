export const feedSessions = [
  {
    id: "market-feed",
    label: "Market updates",
    channel: "pricing",
    freshnessSeconds: 3,
    pendingItems: 1,
    batchingMode: "micro-batch",
    backlogState: "healthy",
    pinnedFilter: "watchlist"
  },
  {
    id: "incident-feed",
    label: "Incident timeline",
    channel: "ops",
    freshnessSeconds: 14,
    pendingItems: 5,
    batchingMode: "burst-batch",
    backlogState: "growing",
    pinnedFilter: "sev1"
  },
  {
    id: "recovering-feed",
    label: "Recovering stream",
    channel: "alerts",
    freshnessSeconds: 35,
    pendingItems: 9,
    batchingMode: "paused",
    backlogState: "repair",
    pinnedFilter: "all"
  }
] as const;

export const feedPolicies = [
  "Differentiate fresh, delayed, and recovering feed states explicitly in the UI.",
  "Batch bursts to preserve readability instead of repainting every event individually.",
  "Show backlog depth and replay controls when freshness falls behind the acceptable threshold.",
  "Preserve pinned filters and scroll anchoring during live updates."
];

export const feedRecovery = [
  { issue: "Backlog growing", action: "Switch to grouped batches and surface a jump-to-latest affordance." },
  { issue: "Stream paused", action: "Freeze the list, show stale state, and offer replay from the last checkpoint." },
  { issue: "Filter drift", action: "Keep user-selected filters pinned while replay batches apply." }
];
