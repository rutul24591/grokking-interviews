import express from "express";

const app = express();

app.get("/search", async (req, res) => {
  const query = String(req.query.q || "");
  const tookMs = 200 + Math.max(0, 6 - query.length) * 120;
  await new Promise((resolve) => setTimeout(resolve, tookMs));
  res.json({
    query,
    tookMs,
    results: [`${query} overview`, `${query} tradeoffs`, `${query} interview notes`]
  });
});

app.listen(Number(process.env.PORT || 4390), () => {
  console.log("Request cancellation API on http://localhost:4390");
});
