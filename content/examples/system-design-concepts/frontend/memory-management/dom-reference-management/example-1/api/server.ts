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

let sections = [
  { id: "hero", title: "Hero", status: "Pinned above the fold" },
  { id: "tradeoffs", title: "Trade-offs", status: "Measured for quick jumps" },
  { id: "examples", title: "Examples", status: "Frequently reordered by user intent" }
];
let notes = [
  "Ref registries should delete entries for removed nodes.",
  "Stable ids matter more than list indices when refs track dynamic children.",
  "Scrolling and measurement should use currently mounted nodes only."
];

app.get("/state", (_, res) => {
  res.json({ sections, notes });
});

app.post("/action", (req, res) => {
  const actionId = String(req.body?.actionId ?? "");
  const sectionId = String(req.body?.sectionId ?? "");
  if (actionId === "reorder") sections = [sections[1], sections[2], sections[0]].filter(Boolean);
  if (actionId === "remove") sections = sections.filter((section) => section.id !== sectionId);
  if (actionId === "focus") notes = [`Focused ${sectionId} using live ref lookup.`, ...notes].slice(0, 4);
  res.json({ ok: true });
});

app.listen(4531, () => {
  console.log("DOM ref API on http://localhost:4531");
});
