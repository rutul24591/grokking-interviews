export type DocumentState = "indexed" | "stale" | "pending";
export type SearchDocument = { id: string; title: string; topic: string; freshnessMinutes: number; state: DocumentState };
export const indexingState = {
  queueDepth: 3,
  mode: "incremental",
  documents: [
    { id: "d1", title: "Search ranking basics", topic: "search", freshnessMinutes: 4, state: "indexed" as DocumentState },
    { id: "d2", title: "Freshness-aware feed ranking", topic: "feeds", freshnessMinutes: 18, state: "stale" as DocumentState },
    { id: "d3", title: "Recommendation cold start", topic: "recs", freshnessMinutes: 0, state: "pending" as DocumentState },
    { id: "d4", title: "Index compaction strategies", topic: "search", freshnessMinutes: 2, state: "indexed" as DocumentState }
  ],
  lastMessage: "Incremental indexing keeps fresh documents searchable while the backlog stays bounded."
};
