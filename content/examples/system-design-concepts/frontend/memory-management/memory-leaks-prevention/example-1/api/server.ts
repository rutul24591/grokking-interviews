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

type LeakKey = "timers" | "listeners" | "cache" | "detachedData";
type LeakSource = { label: string; retained: number; note: string };

function initialSources(): Record<LeakKey, LeakSource> {
  return {
    timers: { label: "Polling timers", retained: 4, note: "Intervals from article refresh widgets remain alive after unmount." },
    listeners: { label: "Global listeners", retained: 3, note: "Window listeners keep component state reachable." },
    cache: { label: "Unbounded cache", retained: 6, note: "Request cache grows without eviction for long sessions." },
    detachedData: { label: "Detached DOM payloads", retained: 2, note: "Removed nodes still referenced by feature overlays." }
  };
}
let sources = initialSources();
let cycle = 1;

function currentState() {
  const retained = Object.values(sources).reduce((sum, value) => sum + value.retained, 0);
  return {
    retained,
    budgetStatus: retained <= 14 ? "within-budget" : retained <= 20 ? "warning" : "critical",
    cycle,
    buckets: Object.entries(sources).map(([sourceId, source]) => ({ sourceId, ...source })),
    notes: [
      "Leak budgets should be evaluated over long sessions, not single interactions.",
      "Caches need explicit eviction or they become intentional leaks.",
      "Detached references and abandoned subscriptions usually leak together, not in isolation."
    ]
  };
}

app.get("/state", (_, res) => {
  res.json(currentState());
});
app.post("/action", (req, res) => {
  const actionId = String(req.body?.actionId ?? "");
  const sourceId = String(req.body?.sourceId ?? "") as LeakKey;
  if (actionId === "grow-session") {
    cycle += 1;
    sources = {
      timers: { ...sources.timers, retained: sources.timers.retained + 2 },
      listeners: { ...sources.listeners, retained: sources.listeners.retained + 1 },
      cache: { ...sources.cache, retained: sources.cache.retained + 3 },
      detachedData: { ...sources.detachedData, retained: sources.detachedData.retained + 1 }
    };
  }
  if (actionId === "grow-source" && sources[sourceId]) {
    sources[sourceId] = { ...sources[sourceId], retained: sources[sourceId].retained + 4 };
  }
  if (actionId === "cleanup-source" && sources[sourceId]) {
    const floor = sourceId === "cache" ? 2 : 0;
    sources[sourceId] = { ...sources[sourceId], retained: floor, note: `${sources[sourceId].label} cleaned up and detached references were released.` };
  }
  if (actionId === "cleanup-all") {
    sources = {
      timers: { ...sources.timers, retained: 0 },
      listeners: { ...sources.listeners, retained: 0 },
      cache: { ...sources.cache, retained: 2 },
      detachedData: { ...sources.detachedData, retained: 0 }
    };
  }
  if (actionId === "reset") {
    sources = initialSources();
    cycle = 1;
  }
  res.json({ ok: true });
});

app.listen(4534, () => {
  console.log("Leak prevention API on http://localhost:4534");
});
