import { brotliCompressSync, gzipSync } from "node:zlib";
import express from "express";

const app = express();
const payload = Buffer.from(
  JSON.stringify({
    title: "Frontend performance report",
    entries: Array.from({ length: 60 }, (_, index) => ({
      id: index + 1,
      category: "rendering",
      summary: "Repeated JSON compresses very well because the dictionary stays small and stable.",
    })),
  }),
);

function selectEncoding(acceptEncodingHeader: string | undefined) {
  const acceptEncoding = acceptEncodingHeader || "";
  if (/\bbr\b/.test(acceptEncoding)) return "br";
  if (/\bgzip\b/.test(acceptEncoding)) return "gzip";
  return "identity";
}

app.get("/payload", (req, res) => {
  const encoding = selectEncoding(req.header("accept-encoding"));

  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=60");
  res.setHeader("Vary", "Accept-Encoding");

  if (encoding === "br") {
    const body = brotliCompressSync(payload);
    res.setHeader("Content-Encoding", "br");
    res.send(body);
    return;
  }

  if (encoding === "gzip") {
    const body = gzipSync(payload);
    res.setHeader("Content-Encoding", "gzip");
    res.send(body);
    return;
  }

  res.send(payload);
});

app.get("/reports", (_req, res) => {
  res.json([
    {
      encoding: "identity",
      rawBytes: payload.byteLength,
      transferredBytes: payload.byteLength,
      note: "No CPU cost, but network transfer is highest.",
    },
    {
      encoding: "gzip",
      rawBytes: payload.byteLength,
      transferredBytes: gzipSync(payload).byteLength,
      note: "Good default compression with broad compatibility.",
    },
    {
      encoding: "br",
      rawBytes: payload.byteLength,
      transferredBytes: brotliCompressSync(payload).byteLength,
      note: "Best compression for text, usually ideal for CDN-cached HTML and JS.",
    },
  ]);
});

const port = Number(process.env.PORT || 4130);
app.listen(port, () => {
  console.log(`Compression API on http://localhost:${port}`);
});
