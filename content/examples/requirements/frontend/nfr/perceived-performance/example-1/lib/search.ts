export type Result = { id: string; title: string; score: number };

const corpus: Result[] = [
  { id: "r1", title: "Caching invariants: correctness first", score: 95 },
  { id: "r2", title: "Retry budgets and user-perceived latency", score: 90 },
  { id: "r3", title: "Skeletons vs spinners: when to use which", score: 88 },
  { id: "r4", title: "Optimistic updates and reconciliation", score: 86 },
  { id: "r5", title: "Debounce, abort, and dedupe for search UX", score: 84 }
];

export async function search(query: string, delayMs: number) {
  await new Promise((r) => setTimeout(r, delayMs));
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return corpus
    .filter((r) => r.title.toLowerCase().includes(q))
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);
}

let liked = new Set<string>();

export function toggleLike(id: string) {
  if (liked.has(id)) liked.delete(id);
  else liked.add(id);
  return { liked: [...liked.values()] };
}

