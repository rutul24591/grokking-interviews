import express from "express";

const app = express();

app.get("/bundle-report", (_req, res) => {
  res.json([
    {
      id: "b1",
      title: "Trim heavy date libraries",
      updatedAt: new Date().toISOString(),
      note: "Replace general-purpose packages when the route only needs simple date formatting.",
    },
    {
      id: "b2",
      title: "Load charts on demand",
      updatedAt: new Date(Date.now() - 86400000).toISOString(),
      note: "Large visualization libraries belong in secondary chunks triggered by explicit user intent.",
    },
    {
      id: "b3",
      title: "Audit vendor duplication",
      updatedAt: new Date(Date.now() - 172800000).toISOString(),
      note: "Chunk count is not the problem by itself; duplicated vendors across chunks usually are.",
    },
  ]);
});

const port = Number(process.env.PORT || 4110);
app.listen(port, () => {
  console.log(`Bundle-size API on http://localhost:${port}`);
});

