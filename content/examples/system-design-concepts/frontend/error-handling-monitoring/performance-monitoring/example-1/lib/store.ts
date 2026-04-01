export type Metric = { id: string; name: string; value: number; budget: number; trend: "up" | "down" | "flat"; owner: string };
export const perfState = {
  metrics: [
    { id: "m1", name: "LCP", value: 2.4, budget: 2.5, trend: "down" as const, owner: "web-foundations" },
    { id: "m2", name: "CLS", value: 0.07, budget: 0.1, trend: "flat" as const, owner: "design-systems" },
    { id: "m3", name: "INP", value: 210, budget: 200, trend: "up" as const, owner: "article-experience" }
  ],
  release: "2026.04.01",
  lastMessage: "Performance monitoring compares real-user metrics against experience budgets."
};
