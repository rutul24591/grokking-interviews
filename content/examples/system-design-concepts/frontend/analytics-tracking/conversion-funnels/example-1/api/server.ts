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

type StageName = "landing" | "article" | "signup" | "pricing" | "checkout";
const order: StageName[] = ["landing", "article", "signup", "pricing", "checkout"];
const baselines: Record<string, Record<StageName, number>> = {
  healthy: { landing: 2400, article: 1680, signup: 840, pricing: 560, checkout: 392 },
  "pricing-dropoff": { landing: 2400, article: 1680, signup: 840, pricing: 290, checkout: 116 }
};
let activeScenario = "healthy";
let adjustments: Partial<Record<StageName, number>> = {};

function buildStages() {
  const current = baselines[activeScenario];
  return order.map((stage, index) => {
    const users = current[stage] + (adjustments[stage] ?? 0);
    const previous = index === 0 ? users : current[order[index - 1]] + (adjustments[order[index - 1]] ?? 0);
    return {
      stage,
      users,
      conversionFromPrevious: index === 0 ? 100 : Math.round((users / Math.max(previous, 1)) * 100)
    };
  });
}

app.get("/report", (req, res) => {
  const requested = typeof req.query.scenario === "string" ? req.query.scenario : activeScenario;
  if (requested in baselines && requested !== activeScenario) {
    activeScenario = requested;
    adjustments = {};
  }
  const stages = buildStages();
  const checkout = stages.find((stage) => stage.stage === "checkout")?.users ?? 0;
  res.json({
    scenario: activeScenario,
    stages,
    notes: [
      `${checkout} users reach checkout in the active scenario`,
      activeScenario === "healthy" ? "Pricing copy is holding its conversion target." : "Pricing step drop-off exceeds the 20% alert threshold.",
      "Treat funnel events as ordered milestones; replayed or out-of-order events distort stage conversion."
    ]
  });
});

app.post("/simulate", (req, res) => {
  const scenario = req.body?.scenario;
  if (!(scenario in baselines)) {
    res.status(400).json({ error: "Unknown scenario" });
    return;
  }
  activeScenario = scenario;
  adjustments = {};
  res.json({ ok: true });
});

app.post("/events", (req, res) => {
  const stage = req.body?.stage as StageName;
  const delta = Number(req.body?.delta ?? 0);
  if (!order.includes(stage) || Number.isNaN(delta)) {
    res.status(400).json({ error: "Invalid stage update" });
    return;
  }
  adjustments[stage] = (adjustments[stage] ?? 0) + delta;
  res.json({ ok: true });
});

app.listen(4511, () => {
  console.log("Conversion funnel API on http://localhost:4511");
});
