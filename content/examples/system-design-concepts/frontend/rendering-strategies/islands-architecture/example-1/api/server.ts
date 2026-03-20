import cors from "cors";
import express from "express";

type Article = {
  id: string;
  title: string;
  summary: string;
  publishedAt: string;
};

const articles: Article[] = [
  {
    id: "a-1",
    title: "Streaming SSR: Suspense Boundaries",
    summary: "Flush a fast shell while slow content streams later. Avoid buffering proxies.",
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
  },
  {
    id: "a-2",
    title: "Partial Hydration with Server Actions",
    summary: "Keep most UI server-rendered and hydrate only interaction hotspots.",
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
  },
  {
    id: "a-3",
    title: "Edge Rendering and Personalization",
    summary: "Run latency-sensitive logic close to users while respecting edge constraints.",
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12).toISOString(),
  },
];

// In-memory bookmarks: uid -> set(articleId)
const bookmarks = new Map<string, Set<string>>();

function getSet(uid: string) {
  let set = bookmarks.get(uid);
  if (!set) {
    set = new Set();
    bookmarks.set(uid, set);
  }
  return set;
}

const app = express();
app.use(cors());

app.get("/v1/articles", (_req, res) => {
  res.json(articles);
});

app.get("/v1/bookmarks", (req, res) => {
  const uid = String(req.query.uid ?? "guest");
  const set = getSet(uid);
  res.json({ uid, bookmarkedIds: Array.from(set), ts: new Date().toISOString() });
});

app.post("/v1/bookmarks/:id/toggle", (req, res) => {
  const uid = String(req.query.uid ?? "guest");
  const id = String(req.params.id ?? "");
  const set = getSet(uid);
  if (set.has(id)) set.delete(id);
  else set.add(id);
  res.json({ uid, bookmarkedIds: Array.from(set), ts: new Date().toISOString() });
});

const port = Number(process.env.ORIGIN_PORT ?? "4030");
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Origin API listening on http://localhost:${port}`);
});

