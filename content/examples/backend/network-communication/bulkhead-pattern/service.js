import express from "express";
import fetch from "node-fetch";
import { Pool } from "./pool.js";

const app = express();
const criticalPool = new Pool(2);
const optionalPool = new Pool(1);

app.get("/report", async (req, res) => {
  const critical = criticalPool.run(async () => {
    const out = await fetch("http://localhost:5001/critical");
    return await out.text();
  });

  const optional = optionalPool.run(async () => {
    const out = await fetch("http://localhost:5002/optional");
    return await out.text();
  });

  const result = await Promise.allSettled([critical, optional]);
  res.json({ critical: result[0].value, optional: result[1].value });
});

app.listen(5000, () => console.log("service on :5000"));