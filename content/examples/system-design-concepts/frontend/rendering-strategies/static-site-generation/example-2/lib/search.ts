import indexData from "@/content/search-index.json";

type Index = {
  tokens: Record<string, string[]>;
  posts: Record<string, { slug: string; title: string; excerpt: string }>;
};

const index = indexData as Index;

function tokenize(q: string) {
  return q
    .toLowerCase()
    .split(/[^a-z0-9]+/g)
    .map((t) => t.trim())
    .filter(Boolean);
}

export function search(q: string) {
  const tokens = tokenize(q);
  const counts = new Map<string, number>();

  for (const t of tokens) {
    const hits = index.tokens[t] ?? [];
    for (const slug of hits) {
      counts.set(slug, (counts.get(slug) ?? 0) + 1);
    }
  }

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([slug]) => index.posts[slug])
    .filter(Boolean);
}

