import express from "express";
const app = express();
let failures = 0;
let openUntil = 0;
app.get("/profile", (_req, res) => {
  const now = Date.now();
  if (now < openUntil) return res.json({ state: "open", result: "fallback profile" });
  const shouldFail = failures < 3;
  if (shouldFail) {
    failures += 1;
    if (failures >= 3) openUntil = now + 4000;
    return res.status(503).json({ state: failures >= 3 ? "open" : "closed", result: "upstream failure" });
  }
  failures = 0;
  res.json({ state: "half-open/closed", result: "live profile" });
});
app.listen(Number(process.env.PORT || 4320), () => console.log("Circuit breaker API on http://localhost:4320"));
