type ArticleRecord = {
  id: string;
  title: string;
  body: string;
  likes: number;
  updatedAt: string;
};

declare global {
  // eslint-disable-next-line no-var
  var __partialHydrationStore: Map<string, ArticleRecord> | undefined;
}

const store =
  globalThis.__partialHydrationStore ??
  (globalThis.__partialHydrationStore = new Map<string, ArticleRecord>());

function seed() {
  if (store.size > 0) return;
  store.set("a-1", {
    id: "a-1",
    title: "Partial Hydration for Content-heavy Apps",
    body:
      "Render most of the page on the server, then hydrate only interaction hotspots. " +
      "This keeps JS small and reduces hydration work. " +
      "Common islands: like/bookmark buttons, follow controls, comment composers, and editors.",
    likes: 41,
    updatedAt: new Date().toISOString(),
  });
}

seed();

export function getArticle(id: string): ArticleRecord {
  const value = store.get(id);
  if (!value) throw new Error("not found");
  return value;
}

export function likeArticle(id: string): ArticleRecord {
  const current = getArticle(id);
  const next: ArticleRecord = {
    ...current,
    likes: current.likes + 1,
    updatedAt: new Date().toISOString(),
  };
  store.set(id, next);
  return next;
}

