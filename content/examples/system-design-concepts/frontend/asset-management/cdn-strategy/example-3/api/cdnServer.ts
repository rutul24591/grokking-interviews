import express from "express";
import path from "node:path";

const port = Number(process.env.CDN_PORT ?? 4001);
const name = process.env.CDN_NAME ?? "primary";
const failPct = Number(process.env.FAIL_PCT ?? 0);

const app = express();
const root = path.join(process.cwd(), "api", "cdn-public");

function shouldFail() {
  if (!Number.isFinite(failPct) || failPct <= 0) return false;
  return Math.random() * 100 < failPct;
}

app.get("/healthz", (_req, res) => res.status(200).json({ ok: true, name, failPct }));

app.use("/assets", (req, res, next) => {
  if (shouldFail()) {
    res.setHeader("X-CDN", name);
    return res.status(503).send("Simulated CDN outage");
  }
  res.setHeader("X-CDN", name);
  next();
});

app.use(
  "/assets",
  express.static(path.join(root, "assets"), {
    etag: true,
    lastModified: true,
    setHeaders: (res, filePath) => {
      const fileName = path.basename(filePath);
      res.setHeader("Content-Type", fileName.endsWith(".svg") ? "image/svg+xml" : "application/octet-stream");
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Cache-Control", "public, max-age=300");
    },
  }),
);

app.listen(port, () => {
  console.log(`[cdn:${name}] http://localhost:${port} (failPct=${failPct})`);
});

