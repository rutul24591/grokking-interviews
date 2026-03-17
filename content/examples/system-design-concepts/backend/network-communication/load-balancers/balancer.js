import express from "express";
import fetch from "node-fetch";
import { pickTarget, reportFailure } from "./targets.js";

const app = express();
app.use(express.json());

app.all("/api/*", async (req, res) => {
  const target = pickTarget();
  if (!target) {
    res.status(503).json({ error: "no_healthy_targets" });
    return;
  }

  try {
    const upstream = await fetch(target + req.originalUrl, {
      method: req.method,
      headers: { "content-type": "application/json" },
      body: req.method === "GET" ? undefined : JSON.stringify(req.body),
    });

    const body = await upstream.text();
    res.status(upstream.status).send(body);
  } catch (err) {
    reportFailure(target);
    res.status(502).json({ error: "upstream_failure" });
  }
});

app.listen(4000, () => console.log("balancer on :4000"));