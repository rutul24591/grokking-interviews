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

let sessionId = "session-1";
let steps = ["open-subcategory"];

function notes() {
  return [
    `current session ${sessionId} contains ${steps.length} step(s)`,
    steps.includes("toggle-examples") ? "reader inspected code examples before copying code" : "reader has not opened the examples tab yet",
    "journey stitching depends on stable session identifiers and monotonic event ordering"
  ];
}

app.get("/journey", (_, res) => {
  res.json({ sessionId, steps, notes: notes() });
});

app.post("/journey", (req, res) => {
  const step = String(req.body?.step ?? "unknown");
  steps = [...steps, step];
  res.json({ ok: true });
});

app.post("/reset", (_, res) => {
  sessionId = `session-${Date.now()}`;
  steps = ["open-subcategory"];
  res.json({ ok: true });
});

app.listen(4517, () => {
  console.log("User journey API on http://localhost:4517");
});
