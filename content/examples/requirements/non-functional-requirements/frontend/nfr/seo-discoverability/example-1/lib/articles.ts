export type Article = {
  slug: string;
  title: string;
  description: string;
  publishedAt: string; // ISO
};

export const ARTICLES: Article[] = [
  {
    slug: "design-cache-keys",
    title: "Design cache keys for correctness",
    description: "Cache key cardinality, personalization risks, and safe invariants.",
    publishedAt: "2026-03-20T00:00:00Z"
  },
  {
    slug: "performance-budgets",
    title: "Performance budgets that prevent regressions",
    description: "Turn p95 into a contract and enforce it in CI.",
    publishedAt: "2026-03-19T00:00:00Z"
  }
];

export function getArticle(slug: string) {
  return ARTICLES.find((a) => a.slug === slug) || null;
}

