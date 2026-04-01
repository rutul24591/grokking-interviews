const dataset = [
  { id: "1", title: "SSR basics", level: "intermediate", category: "frontend" },
  { id: "2", title: "Feed ranking", level: "advanced", category: "backend" },
  { id: "3", title: "Caching strategy", level: "beginner", category: "backend" },
  { id: "4", title: "Search UI", level: "intermediate", category: "frontend" }
];

export const facetState = {
  applied: { level: "all", category: "all" },
  available: {
    level: ["all", "beginner", "intermediate", "advanced"],
    category: ["all", "frontend", "backend"]
  },
  results: dataset,
  counts: { level: { beginner: 1, intermediate: 2, advanced: 1 }, category: { frontend: 2, backend: 2 } },
  lastMessage: "Facet state loaded."
};
