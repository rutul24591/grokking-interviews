export type ExploreModuleKey = "trending" | "recommended" | "recent";
export type ExploreCard = { id: string; title: string; source: string; score: number };

export const exploreState = {
  modules: {
    trending: [{ id: "t1", title: "Top distributed systems articles", source: "trending", score: 0.92 }, { id: "t2", title: "Frontend interview patterns", source: "trending", score: 0.86 }],
    recommended: [{ id: "r1", title: "Recommended for staff engineers", source: "recommendations", score: 0.94 }, { id: "r2", title: "System design feed tuning", source: "recommendations", score: 0.88 }],
    recent: [{ id: "n1", title: "Recently published on caching", source: "recent", score: 0.83 }, { id: "n2", title: "New content on routing", source: "recent", score: 0.8 }]
  },
  enabled: { trending: true, recommended: true, recent: true },
  order: ["trending", "recommended", "recent"] as ExploreModuleKey[],
  region: "homepage",
  lastMessage: "The explore page is assembled with all modules active and ordered for the homepage."
};
