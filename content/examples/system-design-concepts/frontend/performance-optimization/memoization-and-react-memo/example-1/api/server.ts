import express from "express";

const app = express();

app.get("/story", (_req, res) => {
  res.json({
    title: "Memoize expensive derivations and stabilize leaf component props.",
    summary:
      "The board below keeps filtering and aggregate work inside `useMemo`, while `React.memo` protects unchanged rows from parent-only renders.",
  });
});

app.get("/items", (_req, res) => {
  res.json([
    { id: "1", title: "Streaming SSR", category: "rendering", score: 91 },
    { id: "2", title: "Connection pooling", category: "networking", score: 83 },
    { id: "3", title: "Tree shaking", category: "rendering", score: 88 },
    { id: "4", title: "Read replicas", category: "storage", score: 76 },
  ]);
});

const port = Number(process.env.PORT || 4180);
app.listen(port, () => {
  console.log(`Memoization API on http://localhost:${port}`);
});
