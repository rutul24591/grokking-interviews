import express from "express";
import fetch from "node-fetch";

const app = express();

async function fetchWithTimeout(url, timeoutMs) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: controller.signal });
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

app.get("/dashboard", async (req, res) => {
  const deadline = Date.now() + 400;
  const remainingA = Math.max(0, deadline - Date.now() - 150);
  const remainingB = Math.max(0, deadline - Date.now() - 50);

  const result = { profile: null, stats: null, partial: false };

  try {
    result.profile = await fetchWithTimeout("http://localhost:4401/profile", remainingA);
  } catch (err) {
    result.partial = true;
  }

  try {
    result.stats = await fetchWithTimeout("http://localhost:4402/stats", remainingB);
  } catch (err) {
    result.partial = true;
  }

  res.json(result);
});

app.listen(4400, () => console.log("aggregator on :4400"));