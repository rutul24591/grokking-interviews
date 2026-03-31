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

let consent = { version: "2026-03", analytics: true, personalization: false, ads: false };
const collector = [] as { type: string; accepted: boolean; reason: string }[];

app.get("/consent", (_, res) => {
  res.json({ consent, collector: collector.slice(-8).reverse() });
});

app.post("/consent", (req, res) => {
  consent = {
    version: typeof req.body?.version === "string" ? req.body.version : consent.version,
    analytics: Boolean(req.body?.analytics),
    personalization: Boolean(req.body?.personalization),
    ads: Boolean(req.body?.ads)
  };
  collector.unshift({ type: "consent_update", accepted: true, reason: `version ${consent.version} applied` });
  res.json({ saved: true, collector: collector.slice(0, 8) });
});

app.post("/track", (req, res) => {
  const category = String(req.body?.category ?? "analytics");
  const accepted = category !== "analytics" || consent.analytics;
  collector.unshift({
    type: String(req.body?.type ?? "unknown"),
    accepted,
    reason: accepted ? "consent allows analytics collection" : "analytics category is disabled"
  });
  res.json({ collector: collector.slice(0, 8) });
});

app.listen(4512, () => {
  console.log("Consent API on http://localhost:4512");
});
