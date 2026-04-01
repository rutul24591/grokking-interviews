export type SeriesPoint = { label: string; value: number };
export type ChartSeries = { id: string; name: string; kind: "line" | "bar"; points: SeriesPoint[]; visible: boolean };
export const chartState = {
  library: "adapter-driven-chart-shell",
  filter: "weekly",
  series: [
    { id: "views", name: "Views", kind: "line" as const, visible: true, points: [{ label: "Mon", value: 120 }, { label: "Tue", value: 140 }, { label: "Wed", value: 138 }] },
    { id: "shares", name: "Shares", kind: "bar" as const, visible: true, points: [{ label: "Mon", value: 14 }, { label: "Tue", value: 19 }, { label: "Wed", value: 22 }] },
    { id: "errors", name: "Errors", kind: "line" as const, visible: false, points: [{ label: "Mon", value: 3 }, { label: "Tue", value: 2 }, { label: "Wed", value: 4 }] }
  ],
  lastMessage: "The adapter normalizes backend output before the chart library renders legend, axes, and mixed-series layout."
};
