import express from "express";

const app = express();
app.use(express.json());
const routes = [
  { path: "/feed", label: "Feed", preservedState: "scroll=320" },
  { path: "/saved", label: "Saved", preservedState: "selection=architecture" },
  { path: "/search", label: "Search", preservedState: "query=router" }
];
let activePath = "/feed";
const logs = ["Hydrated on /feed with preserved scroll state."];

app.use((_, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  next();
});
app.options("*", (_, res) => res.sendStatus(204));
app.get("/state", (_, res) => res.json({ routes, activePath, navigationLog: logs.slice(0, 8) }));
app.post("/navigate", (req, res) => {
  const path = String(req.body?.path ?? "/feed");
  activePath = path;
  const match = routes.find((route) => route.path === path);
  logs.unshift(`Client transition to ${path} restored ${match?.preservedState ?? "default state"}.`);
  res.json({ ok: true });
});

app.listen(4541, () => console.log("Client-side routing API on http://localhost:4541"));
