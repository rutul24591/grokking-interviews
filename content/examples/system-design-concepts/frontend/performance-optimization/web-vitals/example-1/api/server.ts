import express from "express";
const app = express();
app.get("/metrics", (_req, res) => {
  res.json([
    { name: "LCP", value: 2140, budget: 2500, unit: "ms", rating: "good" },
    { name: "CLS", value: 0.04, budget: 0.1, unit: "", rating: "good" },
    { name: "INP", value: 186, budget: 200, unit: "ms", rating: "good" },
    { name: "FCP", value: 1730, budget: 1800, unit: "ms", rating: "good" },
    { name: "TTFB", value: 720, budget: 800, unit: "ms", rating: "good" }
  ]);
});
app.listen(Number(process.env.PORT || 4250), () => console.log("Web Vitals API on http://localhost:4250"));
