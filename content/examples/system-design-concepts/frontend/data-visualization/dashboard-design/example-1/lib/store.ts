export type Panel = { id: string; title: string; priority: "high" | "medium" | "low"; status: "healthy" | "stale" | "degraded"; owner: string };
export const dashboardState = {
  viewport: "desktop",
  panels: [
    { id: "kpi", title: "North Star KPIs", priority: "high" as const, status: "healthy" as const, owner: "growth-analytics" },
    { id: "engagement", title: "Engagement Trend", priority: "high" as const, status: "stale" as const, owner: "reader-insights" },
    { id: "alerts", title: "Operational Alerts", priority: "medium" as const, status: "healthy" as const, owner: "frontend-platform" },
    { id: "longtail", title: "Long-tail Content", priority: "low" as const, status: "degraded" as const, owner: "search-ranking" }
  ],
  lastMessage: "Dashboard composition prioritizes high-value panels first and degrades secondary surfaces when space or data freshness is constrained."
};
