export type Mode = "content-based" | "collaborative" | "hybrid";
export type Candidate = { id: string; title: string; cluster: string; topicMatch: number; collaborativeScore: number; recency: number };
export const recommendationState = {
  mode: "hybrid" as Mode,
  userContext: { segment: "principal-engineer", activeTopic: "Search systems" },
  candidates: [
    { id: "r1", title: "Ranking quality playbook", cluster: "search", topicMatch: 0.95, collaborativeScore: 0.62, recency: 0.74 },
    { id: "r2", title: "Feed freshness tuning", cluster: "feeds", topicMatch: 0.66, collaborativeScore: 0.81, recency: 0.91 },
    { id: "r3", title: "Cold-start recommendation guardrails", cluster: "recs", topicMatch: 0.88, collaborativeScore: 0.55, recency: 0.63 },
    { id: "r4", title: "Collaborative filtering pitfalls", cluster: "recs", topicMatch: 0.73, collaborativeScore: 0.93, recency: 0.57 }
  ],
  rankedIds: ["r1", "r4", "r3", "r2"],
  lastMessage: "Hybrid ranking balances topic affinity with collaborative lift."
};
