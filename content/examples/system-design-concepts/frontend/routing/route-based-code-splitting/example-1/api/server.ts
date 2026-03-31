import express from "express";

const app = express();
app.use(express.json());

const routes = [
  { path: "/editor", chunk: "editor.chunk.js", weightKb: 96 },
  { path: "/analytics", chunk: "analytics.chunk.js", weightKb: 74 },
  { path: "/billing", chunk: "billing.chunk.js", weightKb: 58 }
];
let activePath = "/editor";
const logs = ["Loaded editor chunk lazily after route activation."];

app.use((_, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  next();
});
app.options("*", (_, res) => res.sendStatus(204));

app.get("/state", (_, res) => res.json({ routes, activePath, logs: logs.slice(0, 8) }));
app.post("/activate", (req, res) => {
  activePath = String(req.body?.path ?? activePath);
  const route = routes.find((entry) => entry.path === activePath) ?? routes[0];
  logs.unshift(`Activated ${route.path} and fetched ${route.chunk} (${route.weightKb} KB).`);
  res.json({ ok: true });
});

app.listen(4547, () => console.log("Route split API on http://localhost:4547"));
