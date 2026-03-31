import express from "express";

const app = express();

app.get("/story", (_req, res) => {
  res.json({
    title: "Ship the article shell first, then hydrate optional workflows on demand.",
    summary:
      "The article body is first-class. Comments, telemetry dashboards, and related-tooling widgets are not on the critical path and should become secondary chunks.",
    bullets: [
      "Keep the article shell server-rendered.",
      "Move optional panels behind explicit user interaction.",
      "Separate chunk loading from data loading for better observability.",
    ],
  });
});

app.get("/comments", async (_req, res) => {
  await new Promise((resolve) => setTimeout(resolve, 250));
  res.json([
    { id: "1", author: "Rina", body: "Loading comments lazily keeps the reading experience clean and fast." },
    { id: "2", author: "Dev", body: "Optional widgets should not compete with LCP resources." },
  ]);
});

app.get("/insights", async (_req, res) => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  res.json([
    { label: "Chunk size", value: "32 KB" },
    { label: "Load trigger", value: "User click" },
    { label: "Initial JS saved", value: "41 KB" },
  ]);
});

const port = Number(process.env.PORT || 4170);
app.listen(port, () => {
  console.log(`Lazy-loading API on http://localhost:${port}`);
});
