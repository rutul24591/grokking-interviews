import crypto from "crypto";
import express from "express";
import { z } from "zod";
import { getArticle, getFeed, getProfile } from "./store";

const app = express();

app.get("/healthz", (_req, res) => {
  res.status(200).json({ ok: true, ts: new Date().toISOString() });
});

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function sendJsonWithEtag(req: express.Request, res: express.Response, body: unknown, vary?: string) {
  const payload = JSON.stringify(body);
  const etag = crypto.createHash("sha256").update(payload).digest("base64url");

  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "private, max-age=0, must-revalidate");
  res.setHeader("ETag", etag);
  if (vary) res.setHeader("Vary", vary);

  const ifNoneMatch = req.header("if-none-match");
  if (ifNoneMatch && ifNoneMatch === etag) {
    res.status(304).end();
    return;
  }

  res.status(200).send(payload);
}

const listSchema = z.object({
  q: z.string().optional(),
  latencyMs: z.coerce.number().int().min(0).max(5_000).optional(),
  fail: z.coerce.number().int().min(0).max(1).optional(),
});

app.get("/feed", async (req, res) => {
  const parsed = listSchema.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid query", details: parsed.error.flatten() });
    return;
  }

  const uid = req.header("x-user-id") ?? null;
  const { q, latencyMs = 120, fail = 0 } = parsed.data;
  if (fail === 1) {
    res.status(503).json({ error: "Injected failure (fail=1)" });
    return;
  }

  await sleep(latencyMs);
  const body = getFeed({ q: (q ?? "").trim() || null, uid: uid?.trim() || null });
  sendJsonWithEtag(req, res, body, "X-User-Id");
});

app.get("/articles/:id", async (req, res) => {
  const uid = req.header("x-user-id") ?? null;
  await sleep(160);
  const article = getArticle(req.params.id);
  if (!article) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  sendJsonWithEtag(req, res, article, "X-User-Id");
});

app.get("/profile", async (req, res) => {
  const uid = req.header("x-user-id") ?? null;
  await sleep(80);
  const profile = getProfile(uid?.trim() || null);
  if (!profile) {
    res.status(200).json({ uid: "guest", displayName: "Guest", plan: "free" });
    return;
  }
  sendJsonWithEtag(req, res, profile, "X-User-Id");
});

const port = Number(process.env.PORT || 4010);
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`API listening on http://localhost:${port}`);
});

