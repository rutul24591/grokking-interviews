import express from "express";
import { allow } from "./token-bucket.js";

const app = express();
app.use(express.json());

app.use((req, res, next) => {
  const key = req.headers["x-api-key"] || "anon";
  if (!allow(key)) {
    res.status(429).json({ error: "rate_limited" });
    return;
  }
  next();
});

app.get("/data", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(4500, () => console.log("gateway on :4500"));