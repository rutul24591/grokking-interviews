const state = {
  window: "hour" as "hour" | "day" | "week",
  aggregates: {
    hour: [
      { id: "ag-1", label: "API versioning", likes: 14, comments: 3, shares: 1, rankingDelta: "+2", lagSeconds: 12 },
      { id: "ag-2", label: "CDN invalidation", likes: 9, comments: 2, shares: 0, rankingDelta: "-1", lagSeconds: 18 }
    ],
    day: [
      { id: "ag-1", label: "API versioning", likes: 102, comments: 18, shares: 7, rankingDelta: "+5", lagSeconds: 28 },
      { id: "ag-2", label: "CDN invalidation", likes: 87, comments: 11, shares: 5, rankingDelta: "+1", lagSeconds: 35 }
    ],
    week: [
      { id: "ag-1", label: "API versioning", likes: 488, comments: 64, shares: 31, rankingDelta: "+9", lagSeconds: 70 },
      { id: "ag-2", label: "CDN invalidation", likes: 401, comments: 52, shares: 29, rankingDelta: "+4", lagSeconds: 82 }
    ]
  },
  sources: {
    hour: { streamLag: "healthy", reconciliation: "hourly rebuild not needed", consumers: "feed + notifications" },
    day: { streamLag: "watch", reconciliation: "one shard pending replay", consumers: "feed + creator studio" },
    week: { streamLag: "degraded", reconciliation: "rollup rebuild scheduled", consumers: "creator studio + trending" }
  },
  lastMessage: "Engagement aggregation should align counters across feed, detail, and analytics surfaces while surfacing lag and rebuild status."
};

export function snapshot() {
  const aggregates = state.aggregates[state.window];
  const totals = aggregates.reduce((acc, aggregate) => ({
    likes: acc.likes + aggregate.likes,
    comments: acc.comments + aggregate.comments,
    shares: acc.shares + aggregate.shares
  }), { likes: 0, comments: 0, shares: 0 });
  return structuredClone({
    window: state.window,
    aggregates,
    totals,
    sourceHealth: state.sources[state.window],
    lastMessage: state.lastMessage
  });
}

export function mutate(window: "hour" | "day" | "week") {
  state.window = window;
  state.lastMessage = `Loaded ${window} aggregates with stream lag and reconciliation context for downstream counters.`;
  return snapshot();
}
