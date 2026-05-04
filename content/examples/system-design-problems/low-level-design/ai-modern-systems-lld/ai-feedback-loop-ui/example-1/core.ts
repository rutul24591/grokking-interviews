export type Feedback = { id: string; at: number; itemId: string; rating: 1 | 2 | 3 | 4 | 5; tags: string[]; comment?: string };

export function summarize(feedback: Feedback[]) {
  const avg = feedback.reduce((a, f) => a + f.rating, 0) / Math.max(1, feedback.length);
  const tagCounts: Record<string, number> = {};
  for (const f of feedback) for (const t of f.tags) tagCounts[t] = (tagCounts[t] ?? 0) + 1;
  return { avg, tagCounts };
}
