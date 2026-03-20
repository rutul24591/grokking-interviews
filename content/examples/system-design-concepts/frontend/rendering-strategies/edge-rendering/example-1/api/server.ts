import cors from "cors";
import express from "express";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const app = express();
app.use(cors());

app.get("/v1/feed", async (req, res) => {
  // Simulate origin latency variability.
  await sleep(220 + Math.floor(Math.random() * 180));

  const uid = String(req.header("x-user-id") ?? "missing");
  const bucket = (String(req.header("x-exp-bucket") ?? "A") === "B" ? "B" : "A") as "A" | "B";

  const base = bucket === "A" ? "Rendering Strategies" : "Performance Optimization";
  const items =
    bucket === "A"
      ? [
          { id: "a1", title: `${base}: Streaming SSR`, reason: "Flush the shell early with Suspense boundaries." },
          { id: "a2", title: `${base}: ISR`, reason: "Keep pages fresh without per-request SSR." },
        ]
      : [
          { id: "b1", title: `${base}: Partial Hydration`, reason: "Keep client JS small; hydrate only what’s needed." },
          { id: "b2", title: `${base}: Edge Rendering`, reason: "Run latency-sensitive logic closer to users." },
        ];

  res.json({
    uid,
    bucket,
    generatedAt: new Date().toISOString(),
    items,
  });
});

const port = Number(process.env.ORIGIN_PORT ?? "4020");
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Origin API listening on http://localhost:${port}`);
});

