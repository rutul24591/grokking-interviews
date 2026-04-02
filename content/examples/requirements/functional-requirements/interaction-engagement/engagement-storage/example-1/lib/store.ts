const state = {
  view: "hot" as "hot" | "warm" | "archive",
  rows: {
    hot: [
      { id: "es-1", entity: "post-118 counters", model: "key-value", consistency: "read-after-write", p95ReadMs: 11, retention: "7 days", recovery: "rebuild from event log" },
      { id: "es-2", entity: "reaction tallies", model: "sorted-set", consistency: "eventual", p95ReadMs: 18, retention: "3 days", recovery: "replay shard delta" }
    ],
    warm: [
      { id: "es-3", entity: "daily rollups", model: "columnar", consistency: "batch-consistent", p95ReadMs: 120, retention: "180 days", recovery: "rerun nightly compaction" },
      { id: "es-4", entity: "comment aggregates", model: "document", consistency: "eventual", p95ReadMs: 84, retention: "90 days", recovery: "hydrate from feed snapshots" }
    ],
    archive: [
      { id: "es-5", entity: "quarterly engagement exports", model: "object-storage", consistency: "immutable", p95ReadMs: 940, retention: "7 years", recovery: "immutable multi-region replica" },
      { id: "es-6", entity: "fraud investigation history", model: "warehouse", consistency: "append-only", p95ReadMs: 1320, retention: "2 years", recovery: "warehouse replay + audit export" }
    ]
  },
  tierNotes: {
    hot: { writeRate: "120k/min", failover: "cross-zone replica", consumers: "feed, detail, reactions" },
    warm: { writeRate: "30k/min", failover: "delayed replay", consumers: "creator studio, moderation" },
    archive: { writeRate: "nightly batch", failover: "cold restore", consumers: "finance, compliance, research" }
  },
  lastMessage: "Engagement storage should separate hot counters, rollups, and archives so each surface hits the correct latency and durability tier."
};

export function snapshot() {
  return structuredClone({
    view: state.view,
    rows: state.rows[state.view],
    tierNote: state.tierNotes[state.view],
    lastMessage: state.lastMessage
  });
}

export function mutate(view: "hot" | "warm" | "archive") {
  state.view = view;
  state.lastMessage = `Loaded ${view} storage view with failover and consumer context.`;
  return snapshot();
}
