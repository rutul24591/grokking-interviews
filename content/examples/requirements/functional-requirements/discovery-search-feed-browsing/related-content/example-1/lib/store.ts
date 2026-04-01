export type Strategy = "tag-overlap" | "same-series" | "hybrid";
export type ContentItem = { id: string; title: string; series: string; sharedTags: number; recency: number };
export const relatedState = {
  strategy: "hybrid" as Strategy,
  current: { id: "current", title: "Designing ranking systems", series: "search-architecture" },
  candidates: [
    { id: "c1", title: "Search quality metrics", series: "search-architecture", sharedTags: 4, recency: 0.7 },
    { id: "c2", title: "Feed personalization guardrails", series: "feed-ops", sharedTags: 3, recency: 0.9 },
    { id: "c3", title: "Index freshness at scale", series: "search-architecture", sharedTags: 2, recency: 0.8 },
    { id: "c4", title: "Experiment design for recommendations", series: "recs-lab", sharedTags: 5, recency: 0.6 }
  ],
  relatedIds: ["c1", "c4", "c3"],
  lastMessage: "Hybrid related-content ranking balances similarity and series continuity."
};
