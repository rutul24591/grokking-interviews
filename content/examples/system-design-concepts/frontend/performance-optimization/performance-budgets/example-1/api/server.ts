import express from "express";
const app = express();
app.get("/budgets", (_req, res) => {
  res.json([
    { name: "Route JS", actual: 132, limit: 140, unit: "KB", status: "pass" },
    { name: "Shared vendor", actual: 118, limit: 110, unit: "KB", status: "fail" },
    { name: "CSS", actual: 24, limit: 30, unit: "KB", status: "pass" },
    { name: "LCP", actual: 2350, limit: 2500, unit: "ms", status: "pass" },
  ]);
});
app.listen(Number(process.env.PORT || 4200), () => console.log("Performance budgets API on http://localhost:4200"));
