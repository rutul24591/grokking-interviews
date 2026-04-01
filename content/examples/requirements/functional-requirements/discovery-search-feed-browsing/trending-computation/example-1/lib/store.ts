export type TrendingWindow = "1h" | "6h" | "24h";
export type TrendingItem = { id: string; title: string; views: number; saves: number; acceleration: number };
export const trendingComputationState = {
  window: "6h" as TrendingWindow,
  items: [
    { id: "t1", title: "Search incidents", views: 180, saves: 24, acceleration: 0.72 },
    { id: "t2", title: "Feed freshness tuning", views: 240, saves: 15, acceleration: 0.49 },
    { id: "t3", title: "Recommendation cold start", views: 160, saves: 31, acceleration: 0.81 }
  ],
  rankedIds: ["t3", "t1", "t2"],
  lastMessage: "The 6-hour window balances recency with enough volume to avoid noisy spikes."
};
