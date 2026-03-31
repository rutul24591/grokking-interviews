import express from "express";

const app = express();
app.use(express.json());
app.use((_, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  next();
});
app.options("*", (_, res) => res.sendStatus(204));

function initialGraph() {
  return {
    rootAttached: true,
    closureAttached: true
  };
}
let graph = initialGraph();

function state() {
  return {
    nodes: [
      { id: "ArticlePage", retained: graph.rootAttached, reason: graph.rootAttached ? "reachable from root" : "root released" },
      { id: "RefCache", retained: graph.rootAttached, reason: graph.rootAttached ? "referenced by ArticlePage" : "no live owner" },
      { id: "AsyncClosure", retained: graph.closureAttached, reason: graph.closureAttached ? "still captured by timer callback" : "closure chain broken" }
    ],
    notes: [
      "Garbage collectors work from reachability, not from object age.",
      "Closures and globals frequently become accidental roots.",
      "Breaking the last strong reference makes an object collectible."
    ]
  };
}

app.get("/state", (_, res) => {
  res.json(state());
});
app.post("/action", (req, res) => {
  const actionId = String(req.body?.actionId ?? "");
  if (actionId === "drop-root") graph.rootAttached = false;
  if (actionId === "break-closure") graph.closureAttached = false;
  if (actionId === "reset") graph = initialGraph();
  res.json({ ok: true });
});

app.listen(4533, () => {
  console.log("GC understanding API on http://localhost:4533");
});
