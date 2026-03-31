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

const allowedKeys = ["event", "plan", "device", "article", "cohort"] as const;
const distinctValues = new Map<string, Set<string>>();
const totals: Record<string, number> = { plan: 0, device: 0, article: 0, cohort: 0 };
let accepted = 0;
let rejected = 0;
const recent: string[] = [];

app.post("/events", (req, res) => {
  const payload = req.body ?? {};
  const unknownKeys = Object.keys(payload).filter((key) => !allowedKeys.includes(key as (typeof allowedKeys)[number]));
  if (unknownKeys.length > 0) {
    rejected += 1;
    recent.unshift(`rejected unknown keys: ${unknownKeys.join(", ")}`);
    return res.status(400).json({ ok: false });
  }

  for (const key of ["plan", "device", "article", "cohort"] as const) {
    const value = String(payload[key] ?? "unknown");
    const set = distinctValues.get(key) ?? new Set<string>();
    set.add(value);
    distinctValues.set(key, set);
    if (set.size > 4) {
      rejected += 1;
      recent.unshift(`rejected ${key}=${value} because cardinality exceeded 4 values`);
      return res.status(400).json({ ok: false });
    }
  }

  accepted += 1;
  for (const key of ["plan", "device", "article", "cohort"] as const) totals[key] += 1;
  recent.unshift(`accepted ${payload.event} for plan=${payload.plan} device=${payload.device}`);
  res.json({ ok: true });
});

app.get("/report", (_, res) => {
  res.json({ totals, accepted, rejected, recent: recent.slice(0, 6) });
});

app.listen(4513, () => {
  console.log("Custom dimensions API on http://localhost:4513");
});
