import cors from "cors";
import express from "express";
import { z } from "zod";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const querySchema = z.object({
  delayMs: z
    .string()
    .optional()
    .transform((value) => Number(value ?? "0")),
});

const app = express();
app.use(cors());

app.get("/health", (_req, res) => {
  res.json({ ok: true, ts: new Date().toISOString() });
});

app.get("/api/sidebar", async (req, res) => {
  const parsed = querySchema.safeParse(req.query);
  const delayMs = parsed.success ? Math.max(0, Math.min(8_000, parsed.data.delayMs)) : 0;
  await sleep(delayMs);

  res.json({
    source: "sidebar",
    delayMs,
    items: [
      { id: "rendering", label: "Rendering Strategies" },
      { id: "perf", label: "Performance Optimization" },
      { id: "caching", label: "Caching Strategies" },
      { id: "ux", label: "Edge Cases & UX" },
    ],
    ts: new Date().toISOString(),
  });
});

app.get("/api/recommendations", async (req, res) => {
  const parsed = querySchema.safeParse(req.query);
  const delayMs = parsed.success ? Math.max(0, Math.min(8_000, parsed.data.delayMs)) : 0;
  await sleep(delayMs);

  res.json({
    source: "recommendations",
    delayMs,
    items: [
      {
        id: "rec-1",
        title: "Streaming SSR and TTFB",
        reason: "Flush the shell early; stream slow parts later.",
      },
      {
        id: "rec-2",
        title: "Suspense boundaries in production",
        reason: "Avoid a single slow dependency blocking the whole page.",
      },
      {
        id: "rec-3",
        title: "Beware buffering proxies",
        reason: "Intermediaries can defeat streaming by buffering responses.",
      },
    ],
    ts: new Date().toISOString(),
  });
});

const port = Number(process.env.ORIGIN_PORT ?? "4010");
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Origin API listening on http://localhost:${port}`);
});

