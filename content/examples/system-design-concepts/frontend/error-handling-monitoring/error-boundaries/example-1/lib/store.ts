export type Widget = { id: string; title: string; status: "healthy" | "crashed"; owner: string };
export const boundaryState = {
  widgets: [
    { id: "w1", title: "Recommendations rail", status: "healthy" as const, owner: "discovery" },
    { id: "w2", title: "Ranking insights panel", status: "crashed" as const, owner: "search" },
    { id: "w3", title: "Analytics sparkline", status: "healthy" as const, owner: "observability" }
  ],
  selectedWidget: "w2",
  fallbackVisible: true,
  incidentCount: 1,
  lastMessage: "The boundary isolates the failed widget and keeps the rest of the page interactive."
};
