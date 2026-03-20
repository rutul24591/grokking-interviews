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
    id: "s1",
    title: "SSR: fast HTML, then hydrate",
    excerpt:
      "SSR returns real HTML for the first paint, then hydrates to attach interactivity. Great for SEO and perceived performance.",
    body:
      "SSR means the server executes your React tree and outputs HTML.\n\nThe browser can paint meaningful UI earlier. Later, JavaScript hydrates the markup and attaches event handlers.\n\nOperationally, SSR shifts work to the server: compute per request, cache design, upstream dependencies.",
    tags: ["ssr", "hydration", "seo"],
    updatedAt: new Date(now - 1000 * 60 * 52).toISOString(),
  },
  {
    id: "s2",
    title: "Avoid SSR waterfalls",
    excerpt:
      "When the server does sequential dependent fetches, TTFB grows. Parallelize independent calls and coalesce duplicates.",
    body:
      "A common SSR anti-pattern is the data-fetch waterfall: fetch A, wait, then fetch B.\n\nWhen possible, fetch independent data in parallel (Promise.all).\n\nIf multiple components need the same data, dedupe requests to reduce upstream load.",
    tags: ["ttfb", "performance", "waterfall"],
    updatedAt: new Date(now - 1000 * 60 * 24).toISOString(),
  },
  {
    id: "s3",
    title: "Personalization changes caching",
    excerpt:
      "If HTML depends on cookies, caching must vary by user; otherwise you risk cache poisoning and data leaks.",
    body:
      "Personalization is common in SSR: greet the user, show tailored recommendations, or gate features.\n\nThis makes responses user-dependent. Shared caches must vary on a safe key (e.g., a session id or user segment) and must not serve one user's HTML to another.\n\nUse `Vary` carefully and avoid caching sensitive pages at the CDN by default.",
    tags: ["caching", "security", "vary"],
    updatedAt: new Date(now - 1000 * 60 * 9).toISOString(),
  },
];

function filterRows(rows: ArticleRow[], q: string | null) {
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

export function getFeed(params: { q: string | null; uid: string | null }) {
  const filtered = filterRows(seed, params.q);
  const items = filtered
    .slice()
    .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1))
    .map((r) => ({
      id: r.id,
      title: r.title,
      excerpt: r.excerpt,
      tags: r.tags,
      updatedAt: r.updatedAt,
      personalizedReason:
        params.uid === "alice"
          ? "Highlighted for Alice (demo personalization)"
          : params.uid === "bob"
            ? "Highlighted for Bob (demo personalization)"
            : undefined,
    }));
  return { items };
}

export function getArticle(id: string) {
  const row = seed.find((r) => r.id === id);
  if (!row) return null;
  return {
    id: row.id,
    title: row.title,
    updatedAt: row.updatedAt,
    body: row.body,
  };
}

export function getProfile(uid: string | null) {
  if (!uid) return null;
  if (uid === "alice") return { uid, displayName: "Alice", plan: "pro" as const };
  if (uid === "bob") return { uid, displayName: "Bob", plan: "free" as const };
  return { uid, displayName: uid, plan: "free" as const };
}

