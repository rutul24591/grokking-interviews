import express from "express";

const app = express();

app.get("/recommendations", async (_req, res) => {
  await new Promise((resolve) => setTimeout(resolve, 220));
  res.json([
    {
      id: "r1",
      title: "Preload the LCP image",
      reason: "If the hero image is the largest contentful paint element, treat it as critical.",
    },
    {
      id: "r2",
      title: "Reserve layout slots",
      reason: "Explicit dimensions prevent layout shifts when images and fonts arrive later.",
    },
    {
      id: "r3",
      title: "Defer third-party scripts",
      reason: "Analytics and chat widgets should not sit on the first-render critical path.",
    },
  ]);
});

const port = Number(process.env.PORT || 4100);
app.listen(port, () => {
  console.log(`Above-the-fold API on http://localhost:${port}`);
});

