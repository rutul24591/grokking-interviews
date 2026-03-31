import express from "express";

const app = express();
app.use(express.json());

let historyStack = [
  { path: "/feed", mode: "pushState" },
  { path: "/saved", mode: "pushState" }
];
let pointer = 1;
const logs = ["Initialized history stack with /feed -> /saved."];

app.use((_, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  next();
});
app.options("*", (_, res) => res.sendStatus(204));

app.get("/state", (_, res) => res.json({ historyStack, pointer, active: historyStack[pointer], logs: logs.slice(0, 8) }));
app.post("/action", (req, res) => {
  const actionId = String(req.body?.actionId ?? "");
  const path = String(req.body?.path ?? "/feed");
  if (actionId === "push") {
    historyStack = [...historyStack.slice(0, pointer + 1), { path, mode: "pushState" }];
    pointer = historyStack.length - 1;
    logs.unshift(`pushState(${path}) appended a new entry.`);
  }
  if (actionId === "replace") {
    historyStack[pointer] = { path, mode: "replaceState" };
    logs.unshift(`replaceState(${path}) updated the current entry.`);
  }
  if (actionId === "back") {
    pointer = Math.max(0, pointer - 1);
    logs.unshift(`Moved backward to ${historyStack[pointer].path}.`);
  }
  res.json({ ok: true });
});

app.listen(4545, () => console.log("History API on http://localhost:4545"));
