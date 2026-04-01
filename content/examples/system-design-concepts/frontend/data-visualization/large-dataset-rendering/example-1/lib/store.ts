export type Slice = {
  bucket: string;
  points: number;
  strategy: "raw" | "aggregated" | "downsampled";
  preservesExtrema: boolean;
  queryCost: "low" | "medium" | "high";
};
export const datasetState = {
  totalPoints: 125000,
  viewportWidth: 980,
  activeWindow: "20k-30k",
  estimatedFrameMs: 18,
  slices: [
    { bucket: "0-10k", points: 10000, strategy: "aggregated" as const, preservesExtrema: true, queryCost: "medium" as const },
    { bucket: "10k-20k", points: 10000, strategy: "aggregated" as const, preservesExtrema: true, queryCost: "medium" as const },
    { bucket: "20k-30k", points: 10000, strategy: "downsampled" as const, preservesExtrema: false, queryCost: "low" as const }
  ],
  lastMessage: "Large datasets should be windowed and summarized before the renderer sees them so interaction stays responsive."
};
