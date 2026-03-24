import express from "express";
import crypto from "node:crypto";
import path from "node:path";

const app = express();

const port = Number(process.env.CDN_PORT ?? 4001);
const root = path.join(process.cwd(), "api", "cdn-public");

function isHashedFilename(fileName: string) {
  // Very small heuristic: `name.<hash>.ext` where hash is 8+ hex chars.
  return /\.[a-f0-9]{8,}\./i.test(fileName);
}

app.use((req, res, next) => {
  res.setHeader("X-Request-Id", crypto.randomUUID());
  next();
});

app.use("/assets", express.static(path.join(root, "assets"), {
  etag: true,
  lastModified: true,
  setHeaders: (res, filePath) => {
    const fileName = path.basename(filePath);
    res.setHeader("Content-Type", fileName.endsWith(".svg") ? "image/svg+xml" : "application/octet-stream");
    res.setHeader("Access-Control-Allow-Origin", "*");
    if (isHashedFilename(fileName)) {
      res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
    } else {
      res.setHeader("Cache-Control", "public, max-age=300");
    }
    // Debug visibility similar to a CDN cache header.
    res.setHeader("X-Cache", "MISS");
  },
}));

app.get("/healthz", (_req, res) => {
  res.status(200).json({ ok: true });
});

app.listen(port, () => {
  console.log(`[cdn] serving ${root} on http://localhost:${port}`);
});
