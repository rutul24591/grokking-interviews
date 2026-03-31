import express from "express";
const app = express();
let windowStart = Date.now();
let count = 0;
const limit = 5;
const windowMs = 5000;
app.get("/search", (_req, res) => {
  const now = Date.now();
  if (now - windowStart >= windowMs) {
    windowStart = now;
    count = 0;
  }
  count += 1;
  if (count > limit) {
    const retryAfterMs = windowMs - (now - windowStart);
    return res.status(429).json({ allowed: false, remaining: 0, retryAfterMs });
  }
  res.json({ allowed: true, remaining: limit - count, retryAfterMs: 0 });
});
app.listen(Number(process.env.PORT || 4300), () => console.log("Rate limit API on http://localhost:4300"));
