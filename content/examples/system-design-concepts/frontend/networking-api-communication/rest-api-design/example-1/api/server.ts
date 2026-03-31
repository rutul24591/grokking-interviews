import express from "express";

const app = express();
app.use(express.json());

const articles = [
  { id: "csr", title: "Client-Side Rendering", author: "Maya Li" },
  { id: "ssr", title: "Server-Side Rendering", author: "Arjun Rao" },
  { id: "isr", title: "Incremental Static Regeneration", author: "Lina Park" }
];

const comments = new Map<string, Array<{ id: string; body: string }>>([
  ["csr", [{ id: "c1", body: "REST benefits when resources stay stable." }]],
  ["ssr", [{ id: "c2", body: "Use HTTP semantics instead of action endpoints." }]],
  ["isr", []]
]);

app.get("/articles", (_req, res) => {
  res.json({ items: articles });
});

app.get("/articles/:articleId", (req, res) => {
  res.json({ article: articles.find((item) => item.id === req.params.articleId), comments: comments.get(req.params.articleId) ?? [] });
});

app.post("/articles/:articleId/comments", (req, res) => {
  const next = { id: crypto.randomUUID(), body: String(req.body.body || "") };
  const current = comments.get(req.params.articleId) ?? [];
  comments.set(req.params.articleId, [next, ...current]);
  res.status(201).json(next);
});

app.listen(Number(process.env.PORT || 4410), () => {
  console.log("REST API design example on http://localhost:4410");
});
