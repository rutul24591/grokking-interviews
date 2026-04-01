export type Series = { label: string; value: number };
export type RenderingState = {
  mode: "svg" | "canvas";
  pointCount: number;
  accessibilityNotes: string[];
  hitTesting: string;
  points: Series[];
  lastMessage: string;
};

export const renderingState: RenderingState = {
  mode: "svg",
  pointCount: 1800,
  accessibilityNotes: ["SVG exposes semantic nodes", "Canvas requires parallel accessible summary"],
  hitTesting: "per-node",
  points: [
    { label: "Articles", value: 42 },
    { label: "Reads", value: 76 },
    { label: "Shares", value: 28 },
    { label: "Bookmarks", value: 33 }
  ],
  lastMessage: "SVG is active for the current scene because accessibility and per-point interaction matter more than raw draw throughput."
};
