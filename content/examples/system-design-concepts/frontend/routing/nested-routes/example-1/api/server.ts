import express from "express";

const app = express();
app.use(express.json());

const sections = [
  { parent: "frontend", child: "routing", label: "Frontend / Routing", ownership: "Platform UI" },
  { parent: "frontend", child: "performance", label: "Frontend / Performance", ownership: "Web Foundations" },
  { parent: "backend", child: "storage", label: "Backend / Storage", ownership: "Data Infrastructure" }
];
let active = sections[0];
const logs = ["Resolved nested route /frontend/routing."];

app.use((_, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  next();
});
app.options("*", (_, res) => res.sendStatus(204));

app.get("/state", (_, res) => res.json({ sections, active, logs: logs.slice(0, 8) }));
app.post("/activate", (req, res) => {
  const parent = String(req.body?.parent ?? active.parent);
  const child = String(req.body?.child ?? active.child);
  active = sections.find((section) => section.parent === parent && section.child === child) ?? sections[0];
  logs.unshift(`Nested route /${active.parent}/${active.child} loaded ${active.ownership} data boundaries.`);
  res.json({ ok: true });
});

app.listen(4546, () => console.log("Nested routes API on http://localhost:4546"));
