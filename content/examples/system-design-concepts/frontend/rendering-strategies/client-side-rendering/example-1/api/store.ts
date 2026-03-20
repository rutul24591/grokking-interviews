type ArticleRow = {
  id: string;
  title: string;
  excerpt: string;
  body: string;
  tags: string[];
  updatedAt: string;
};

const now = Date.now();
const seed: ArticleRow[] = [
  {
    id: "a1",
    title: "CSR: Why the browser becomes your runtime",
    excerpt:
      "CSR shifts rendering to the client, turning the browser into a constrained runtime that must schedule work and fetch data efficiently.",
    body:
      "Client-Side Rendering makes the browser responsible for building the UI after downloading JavaScript.\n\nThe upside is rich interactivity and fast client-side navigation.\n\nThe downside is you now pay the cost in JS download/parse/execute and main-thread CPU.\n\nProduction work is mostly about controlling those costs: code splitting, caching, cancellation, and robust UX during failure.",
    tags: ["csr", "runtime", "performance"],
    updatedAt: new Date(now - 1000 * 60 * 60 * 3).toISOString(),
  },
  {
    id: "a2",
    title: "CSR data fetching: cancellation + dedupe",
    excerpt:
      "Fast search and navigation can create stale updates. Avoid it with AbortController and in-flight request deduplication.",
    body:
      "If the user types quickly, you can have multiple requests in-flight. Without guardrails, the slowest response can win and render stale data.\n\nUse AbortController to cancel old requests and dedupe identical requests so you don’t waste network/CPU.\n\nAdd retry with backoff for transient failures (429/5xx), but keep attempt counts small to avoid harming UX.",
    tags: ["fetch", "abortcontroller", "dedupe"],
    updatedAt: new Date(now - 1000 * 60 * 45).toISOString(),
  },
  {
    id: "a3",
    title: "ETag and 304: cheap bandwidth wins",
    excerpt:
      "Even with CSR, HTTP caching still matters. ETag and 304 reduce payload transfer when data hasn't changed.",
    body:
      "ETags let the client validate cached responses. If the content hasn’t changed, the server can return 304 Not Modified.\n\nThis reduces bandwidth and speeds up repeated navigations, especially on mobile.\n\nIt doesn’t fix JS execution cost, but it’s a straightforward win for data-heavy CSR apps.",
    tags: ["http", "etag", "caching"],
    updatedAt: new Date(now - 1000 * 60 * 12).toISOString(),
  },
  {
    id: "a4",
    title: "CSR and perceived performance",
    excerpt:
      "Users experience skeletons, spinners, and delayed interactivity. Design for perception: progressive disclosure and stable layouts.",
    body:
      "Perceived performance is a product feature.\n\nIn CSR you often show loading UI while JS runs and data arrives. Keep layouts stable (avoid CLS), render useful skeletons, and prioritize above-the-fold content.\n\nWhen failures happen, show actionable errors and allow retry without losing user context.",
    tags: ["ux", "skeleton", "cls"],
    updatedAt: new Date(now - 1000 * 60 * 5).toISOString(),
  },
];

function stableFilter(rows: ArticleRow[], q: string | null) {
  if (!q) return rows;
  const needle = q.toLowerCase();
  return rows.filter((r) => {
    return (
      r.title.toLowerCase().includes(needle) ||
      r.excerpt.toLowerCase().includes(needle) ||
      r.tags.some((t) => t.toLowerCase().includes(needle))
    );
  });
}

export function listArticles(params: { cursor: string | null; limit: number; q: string | null }) {
  const filtered = stableFilter(seed, params.q);
  const sorted = filtered.slice().sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));

  const startIndex = params.cursor ? Math.max(0, Number(params.cursor)) : 0;
  const page = sorted.slice(startIndex, startIndex + params.limit);
  const nextCursor =
    startIndex + params.limit < sorted.length ? String(startIndex + params.limit) : null;

  return {
    items: page.map((r) => ({
      id: r.id,
      title: r.title,
      excerpt: r.excerpt,
      tags: r.tags,
      updatedAt: r.updatedAt,
    })),
    nextCursor,
  };
}

export function buildArticleDetail(id: string) {
  const row = seed.find((r) => r.id === id);
  if (!row) return null;
  return {
    id: row.id,
    title: row.title,
    updatedAt: row.updatedAt,
    body: row.body,
  };
}

