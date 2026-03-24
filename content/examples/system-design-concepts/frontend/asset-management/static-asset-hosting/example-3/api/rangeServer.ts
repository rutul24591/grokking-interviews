import express from "express";

const port = Number(process.env.ASSET_PORT ?? 4030);
const app = express();

// Generate a deterministic "large" asset in memory.
const bytes = Buffer.from(
  Array.from({ length: 256 * 1024 }, (_, i) => String.fromCharCode(65 + (i % 26))).join(""),
  "utf-8",
);

app.get("/healthz", (_req, res) => res.status(200).json({ ok: true }));

app.get("/asset.bin", (req, res) => {
  const range = req.headers.range;
  const total = bytes.length;

  res.setHeader("Accept-Ranges", "bytes");
  res.setHeader("Content-Type", "application/octet-stream");
  res.setHeader("Cache-Control", "public, max-age=300");

  if (!range) {
    res.setHeader("Content-Length", String(total));
    return res.status(200).send(bytes);
  }

  const m = /^bytes=(\d+)-(\d+)?$/.exec(range);
  if (!m) return res.status(416).send("Invalid range");

  const start = Number(m[1]);
  const end = m[2] ? Number(m[2]) : Math.min(total - 1, start + 1024 * 8);
  if (start >= total || end >= total || start > end) return res.status(416).send("Range not satisfiable");

  const chunk = bytes.subarray(start, end + 1);
  res.status(206);
  res.setHeader("Content-Range", `bytes ${start}-${end}/${total}`);
  res.setHeader("Content-Length", String(chunk.length));
  return res.send(chunk);
});

app.listen(port, () => {
  console.log(`[range-assets] http://localhost:${port}/asset.bin`);
});

