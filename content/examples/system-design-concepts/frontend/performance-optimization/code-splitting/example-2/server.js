import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/search-config", (_req, res) => {
  res.json({
    suggestions: ["SSR", "ISR", "Streaming", "Partial hydration"],
    heavyInspectorEnabled: true,
  });
});

const port = Number(process.env.PORT || 4350);
app.listen(port, () => {
  console.log(`Code splitting demo on http://localhost:${port}`);
});
