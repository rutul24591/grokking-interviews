import express from "express";
import path from "node:path";

const port = Number(process.env.FONT_CDN_PORT ?? 4010);
const root = path.join(process.cwd(), "api", "font-public", "fonts");

const app = express();

app.get("/healthz", (_req, res) => res.status(200).json({ ok: true }));

app.use("/fonts", express.static(root, {
  etag: true,
  lastModified: true,
  setHeaders: (res, filePath) => {
    const fileName = path.basename(filePath);
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Cache-Control", "public, max-age=31536000");
    if (fileName.endsWith(".ttf")) res.setHeader("Content-Type", "font/ttf");
  },
}));

app.listen(port, () => {
  console.log(`[font-cdn] serving ${root} on http://localhost:${port}`);
});

