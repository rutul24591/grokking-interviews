export type TagEntry = {
  id: string;
  title: string;
  tags: string[];
  quality: "high" | "medium" | "low";
};
export const taggingState = {
  suggestedTags: ["frontend", "rendering", "requirements", "caching"],
  entries: [
    { id: "tg1", title: "Streaming SSR", tags: ["frontend", "rendering"], quality: "high" as const },
    { id: "tg2", title: "OAuth Providers", tags: ["security", "identity"], quality: "medium" as const },
    { id: "tg3", title: "Service Workers", tags: ["frontend"], quality: "low" as const }
  ],
  lastMessage: "Tagging interfaces should balance author flexibility with editorial consistency so search and discovery remain trustworthy."
};
