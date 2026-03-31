import express from "express";

const app = express();
app.use(express.json());

const corpus = [
  "Streaming SSR",
  "Selective Hydration",
  "Request Deduplication",
  "Edge Rendering",
  "Brotli Compression",
  "Virtualized Lists",
  "Image Optimization",
  "Tree Shaking",
];

app.get("/search", async (req, res) => {
  const query = String(req.query.q || "").toLowerCase();
  await new Promise((resolve) => setTimeout(resolve, 220));

  const results = corpus
    .filter((entry) => entry.toLowerCase().includes(query))
    .slice(0, 5)
    .map((title, index) => ({
      id: `${title}-${index}`,
      title,
      kind: index % 2 === 0 ? "Article result" : "Concept result",
      latencyMs: 220,
    }));

  res.json(results);
});

app.post("/telemetry", (req, res) => {
  console.log("telemetry", req.body);
  res.status(202).json({ accepted: true });
});

const port = Number(process.env.PORT || 4150);
app.listen(port, () => {
  console.log(`Debounce API on http://localhost:${port}`);
});
