export type StreamMetric = {
  id: string;
  label: string;
  current: number;
  lagMs: number;
  history: number[];
  burstRate: number;
  status: "healthy" | "lagging" | "coalesced";
};
export const realtimeState = {
  paused: false,
  mode: "push-simulated",
  staleBanner: false,
  metrics: [
    { id: "active-readers", label: "Active Readers", current: 1840, lagMs: 220, history: [1720, 1765, 1810, 1840], burstRate: 4, status: "healthy" as const },
    { id: "writes", label: "Writes/sec", current: 94, lagMs: 340, history: [82, 86, 91, 94], burstRate: 7, status: "coalesced" as const }
  ],
  lastMessage: "Realtime visualizations need bounded history, lag visibility, and pause controls so they stay interpretable under bursty traffic."
};
