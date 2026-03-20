import cors from "cors";
import crypto from "crypto";
import express from "express";
import { z } from "zod";
import { buildArticleDetail, listArticles } from "./store";

const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000"],
  }),
);

app.get("/healthz", (_req, res) => {
  res.status(200).json({ ok: true, ts: new Date().toISOString() });
});

const listSchema = z.object({
  cursor: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(25).optional(),
  q: z.string().optional(),
  latencyMs: z.coerce.number().int().min(0).max(5_000).optional(),
  fail: z.coerce.number().int().min(0).max(1).optional(),
});

app.get("/articles", async (req, res) => {
  const parsed = listSchema.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid query", details: parsed.error.flatten() });
    return;
  }

  const { cursor, limit = 8, q, latencyMs = 120, fail = 0 } = parsed.data;
  if (fail === 1) {
    res.status(503).json({ error: "Injected failure (fail=1)" });
    return;
  }

  await new Promise((r) => setTimeout(r, latencyMs));

  const response = listArticles({ cursor: cursor ?? null, limit, q: q?.trim() || null });
  const body = JSON.stringify(response);

  const etag = crypto.createHash("sha256").update(body).digest("base64url");
  const ifNoneMatch = req.header("if-none-match");
  res.setHeader("Cache-Control", "private, max-age=0, must-revalidate");
  res.setHeader("ETag", etag);

  if (ifNoneMatch && ifNoneMatch === etag) {
    res.status(304).end();
    return;
  }

  res.status(200).type("application/json").send(body);
});

const detailSchema = z.object({
  latencyMs: z.coerce.number().int().min(0).max(5_000).optional(),
  fail: z.coerce.number().int().min(0).max(1).optional(),
});

app.get("/articles/:id", async (req, res) => {
  const parsed = detailSchema.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid query", details: parsed.error.flatten() });
    return;
  }

  const { latencyMs = 180, fail = 0 } = parsed.data;
  if (fail === 1) {
    res.status(503).json({ error: "Injected failure (fail=1)" });
    return;
  }

  await new Promise((r) => setTimeout(r, latencyMs));

  const article = buildArticleDetail(req.params.id);
  if (!article) {
    res.status(404).json({ error: "Not found" });
    return;
  }

  const body = JSON.stringify(article);
  const etag = crypto.createHash("sha256").update(body).digest("base64url");
  const ifNoneMatch = req.header("if-none-match");
  res.setHeader("Cache-Control", "private, max-age=0, must-revalidate");
  res.setHeader("ETag", etag);

  if (ifNoneMatch && ifNoneMatch === etag) {
    res.status(304).end();
    return;
  }

  res.status(200).type("application/json").send(body);
});

const port = Number(process.env.PORT || 4000);
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`API listening on http://localhost:${port}`);
});

