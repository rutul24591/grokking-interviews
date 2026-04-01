export type LayoutMode = "top-3" | "top-5";
export type Region = "homepage" | "explore";
export type TrendingCard = { id: string; title: string; rank: number; reason: string; badge: string; confidence: number; duplicateGroup: string | null };
export const trendingSectionState = {
  layoutMode: "top-3" as LayoutMode,
  region: "homepage" as Region,
  showReasons: true,
  cards: [
    { id: "c1", title: "Search ranking design", rank: 1, reason: "High save velocity", badge: "trending", confidence: 0.93, duplicateGroup: "search-ranking" },
    { id: "c2", title: "Feed generation", rank: 2, reason: "Rapid recent views", badge: "rising", confidence: 0.84, duplicateGroup: null },
    { id: "c3", title: "Recommendation algorithms", rank: 3, reason: "Strong engagement mix", badge: "hot", confidence: 0.8, duplicateGroup: null },
    { id: "c4", title: "Search analytics", rank: 4, reason: "Cross-category interest", badge: "new", confidence: 0.76, duplicateGroup: "search-ranking" },
    { id: "c5", title: "Elasticsearch", rank: 5, reason: "Sustained search demand", badge: "stable", confidence: 0.72, duplicateGroup: null }
  ],
  visibleIds: ["c1", "c2", "c3"],
  lastMessage: "Homepage mode keeps the section tight and avoids duplicate story lines."
};
