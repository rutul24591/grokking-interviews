import express from "express";

const app = express();
app.use(express.json());

const views = [
  { slug: "caching-patterns", tab: "tradeoffs", title: "Caching Patterns" },
  { slug: "streaming-ssr", tab: "architecture", title: "Streaming SSR" },
  { slug: "route-guards", tab: "pitfalls", title: "Route Guards" }
];
let active = views[0];
const logs = ["Opened canonical deep link for caching-patterns."];

app.use((_, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  next();
});
app.options("*", (_, res) => res.sendStatus(204));

app.get("/state", (_, res) => res.json({ views, active, logs: logs.slice(0, 8) }));
app.post("/open", (req, res) => {
  const slug = String(req.body?.slug ?? active.slug);
  const tab = String(req.body?.tab ?? active.tab);
  const match = views.find((view) => view.slug === slug) ?? views[0];
  active = { ...match, tab };
  logs.unshift(`Resolved deep link /articles/${active.slug}?tab=${active.tab}.`);
  res.json({ ok: true });
});

app.listen(4542, () => console.log("Deep linking API on http://localhost:4542"));
