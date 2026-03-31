import express from "express";

const app = express();
app.use(express.json());

const entities = [
  { type: "article", slug: "system-design-basics", title: "System Design Basics", cacheKey: "article:system-design-basics" },
  { type: "author", slug: "staff-engineer-notes", title: "Staff Engineer Notes", cacheKey: "author:staff-engineer-notes" },
  { type: "collection", slug: "frontend-routing", title: "Frontend Routing", cacheKey: "collection:frontend-routing" }
];
let active = entities[0];
const logs = ["Resolved /articles/system-design-basics from the router manifest."];

app.use((_, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  next();
});
app.options("*", (_, res) => res.sendStatus(204));

app.get("/state", (_, res) => res.json({ entities, active, logs: logs.slice(0, 8) }));
app.post("/resolve", (req, res) => {
  const slug = String(req.body?.slug ?? active.slug);
  active = entities.find((entity) => entity.slug === slug) ?? entities[0];
  logs.unshift(`Matched dynamic segment ${slug} to ${active.type} cache key ${active.cacheKey}.`);
  res.json({ ok: true });
});

app.listen(4543, () => console.log("Dynamic routes API on http://localhost:4543"));
