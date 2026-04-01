export type Segment = { id: string; label: string; value: number; region: string };
export const interactiveState = {
  hoveredId: "seg-1",
  selectedId: "seg-2",
  brushRange: "last-30-days",
  segments: [
    { id: "seg-1", label: "Backend", value: 42, region: "North America" },
    { id: "seg-2", label: "Frontend", value: 58, region: "Europe" },
    { id: "seg-3", label: "Requirements", value: 37, region: "APAC" }
  ],
  lastMessage: "Interactive analytics keep hover, selection, and drilldown state synchronized so users can inspect data without losing context."
};
