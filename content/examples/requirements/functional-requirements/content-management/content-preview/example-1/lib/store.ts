export type PreviewVariant = {
  id: string;
  surface: "web" | "mobile" | "social";
  status: "ready" | "warning" | "missing-media";
  headline: string;
  width: number;
  imageState: "ready" | "cropped" | "missing";
  seoDescription: string;
};

export const previewState = {
  activeSurface: "web",
  variants: [
    {
      id: "p1",
      surface: "web" as const,
      status: "ready" as const,
      headline: "Streaming SSR in Production",
      width: 1280,
      imageState: "ready" as const,
      seoDescription: "Operational preview of streaming server rendering rollout and performance safeguards."
    },
    {
      id: "p2",
      surface: "mobile" as const,
      status: "warning" as const,
      headline: "Streaming SSR in Production",
      width: 390,
      imageState: "cropped" as const,
      seoDescription: "Mobile card truncates summary after 80 characters and needs image safe-zone review."
    },
    {
      id: "p3",
      surface: "social" as const,
      status: "missing-media" as const,
      headline: "Streaming SSR in Production",
      width: 1200,
      imageState: "missing" as const,
      seoDescription: "Social share card is missing the required OG image asset."
    }
  ],
  publishBlocked: true,
  lastMessage: "Publishing should stop when any required preview surface is missing media or exceeds layout constraints."
};
