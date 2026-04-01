export const feedBuilderState = {
  candidatePool: [
    { id: "c1", title: "Distributed systems primer", source: "following", score: 0.92 },
    { id: "c2", title: "Search ranking mistakes", source: "trending", score: 0.86 },
    { id: "c3", title: "Frontend rendering patterns", source: "recommended", score: 0.79 },
    { id: "c4", title: "Caching strategy roundup", source: "trending", score: 0.72 }
  ],
  generated: ["c1", "c2", "c3"],
  diversityGuard: true,
  lastMessage: "Initial feed assembled."
};
