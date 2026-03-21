export type Article = { id: string; title: string; tags: string[]; minutes: number };

export const ALL: Article[] = [
  { id: "a1", title: "Cache keys and correctness", tags: ["caching", "backend"], minutes: 18 },
  { id: "a2", title: "Perceived performance patterns", tags: ["frontend", "ux"], minutes: 14 },
  { id: "a3", title: "State machines for complex flows", tags: ["frontend", "state"], minutes: 22 },
  { id: "a4", title: "Security boundaries for tokens", tags: ["security", "frontend"], minutes: 16 },
  { id: "a5", title: "SSE and realtime UX", tags: ["realtime", "frontend"], minutes: 19 }
];

export function filterArticles(tag: string | null) {
  if (!tag) return ALL;
  return ALL.filter((a) => a.tags.includes(tag));
}

