export type WindowKey = "24h" | "7d" | "30d";
export const analyticsState = {
  window: "7d" as WindowKey,
  queries: [
    { id: "q1", term: "feed ranking", searches: 420, ctr: 0.48, zeroResultRate: 0.03 },
    { id: "q2", term: "system design book", searches: 310, ctr: 0.22, zeroResultRate: 0.27 },
    { id: "q3", term: "vector indexing", searches: 190, ctr: 0.56, zeroResultRate: 0.08 }
  ],
  lastMessage: "The 7-day window highlights zero-result and low-CTR queries for ranking fixes."
};
