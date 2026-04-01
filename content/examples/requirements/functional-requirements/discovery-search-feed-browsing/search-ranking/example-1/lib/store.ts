export type RankingMode = "relevance" | "freshness" | "balanced";
export type RankedResult = { id: string; title: string; bm25: number; freshness: number; quality: number; pinned: boolean; editorialScore: number };
export const searchRankingState = {
  mode: "balanced" as RankingMode,
  pinnedOn: true,
  results: [
    { id: "r1", title: "Search relevance signals", bm25: 0.95, freshness: 0.56, quality: 0.74, pinned: true, editorialScore: 0.82 },
    { id: "r2", title: "Freshness-aware result blending", bm25: 0.83, freshness: 0.88, quality: 0.68, pinned: false, editorialScore: 0.69 },
    { id: "r3", title: "Ranking regression playbook", bm25: 0.79, freshness: 0.61, quality: 0.92, pinned: false, editorialScore: 0.88 },
    { id: "r4", title: "Indexing lag incidents", bm25: 0.7, freshness: 0.94, quality: 0.58, pinned: false, editorialScore: 0.51 }
  ],
  rankedIds: ["r1", "r3", "r2", "r4"],
  metrics: { mrr: 0.71, ndcg: 0.82 },
  lastMessage: "Balanced mode blends lexical relevance with freshness, quality, and optional pinning."
};
