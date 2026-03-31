import express from "express";

const app = express();

app.get("/story", (_req, res) => {
  res.json({
    title: "Ship the hero styles now, not the whole stylesheet.",
    summary:
      "Critical CSS works when the browser already has the exact rules it needs to render the first viewport before the full stylesheet finishes loading.",
    bullets: [
      "Inline the rules required for the first viewport only.",
      "Keep non-critical styles cacheable instead of duplicating them in every HTML document.",
      "Measure TTFB tradeoffs before inlining large amounts of CSS.",
    ],
  });
});

const port = Number(process.env.PORT || 4140);
app.listen(port, () => {
  console.log(`Critical-CSS API on http://localhost:${port}`);
});

