import express from "express";
import path from "node:path";
import fs from "node:fs";
import { sign, timingSafeEqual } from "../lib/signing";

const app = express();
const port = Number(process.env.ASSET_PORT ?? 4020);
const secret = process.env.ASSET_SIGNING_SECRET ?? "dev-secret-change-me";

const publicDir = path.join(process.cwd(), "api", "assets", "public");
const privateDir = path.join(process.cwd(), "api", "assets", "private");

function readFileOr404(dir: string, name: string) {
  const p = path.join(dir, name);
  if (!fs.existsSync(p)) return null;
  return fs.readFileSync(p);
}

app.get("/healthz", (_req, res) => res.status(200).json({ ok: true }));

app.get("/public/:name", (req, res) => {
  const bytes = readFileOr404(publicDir, req.params.name);
  if (!bytes) return res.status(404).send("Not found");
  res.setHeader("Content-Type", req.params.name.endsWith(".svg") ? "image/svg+xml" : "application/octet-stream");
  res.setHeader("Cache-Control", "public, max-age=31536000");
  return res.status(200).send(bytes);
});

app.get("/private/:name", (req, res) => {
  const expires = Number(req.query.expires);
  const token = String(req.query.token ?? "");
  if (!Number.isFinite(expires) || expires <= Date.now()) return res.status(403).send("Expired");

  const pathOnly = `/private/${req.params.name}`;
  const expected = sign({ method: "GET", path: pathOnly, expires, secret });
  if (!timingSafeEqual(expected, token)) return res.status(403).send("Bad signature");

  const bytes = readFileOr404(privateDir, req.params.name);
  if (!bytes) return res.status(404).send("Not found");

  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  return res.status(200).send(bytes);
});

app.listen(port, () => {
  console.log(`[assets] http://localhost:${port} (public/private)`);
});
