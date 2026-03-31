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

const logs: string[] = [];

app.get("/viewer", (_, res) => {
  res.json({ role: "staff-engineer", premiumExamples: true, experimentEnabled: true });
});

app.get("/feed", (_, res) => {
  res.json([
    { title: "Selective Hydration", summary: "Entitlement and experiment guards wrap the card without polluting its rendering logic.", premiumOnly: true },
    { title: "Atomic Design Principles", summary: "Free article cards bypass premium checks but still participate in audit logging.", premiumOnly: false }
  ]);
});

app.post("/audit", (req, res) => {
  logs.unshift(`viewed ${String(req.body?.title ?? "unknown article")}`);
  res.json({ logs: logs.slice(0, 6) });
});

app.listen(4526, () => {
  console.log("HOC API on http://localhost:4526");
});
