import express from "express";
import fetch from "node-fetch";

const app = express();

app.use("/v1", async (req, res) => {
  const upstream = await fetch("http://localhost:4101" + req.originalUrl.replace("/v1", ""));
  res.set("Deprecation", "true");
  res.set("Sunset", "2026-12-01");
  res.status(upstream.status).send(await upstream.text());
});

app.use("/v2", async (req, res) => {
  const upstream = await fetch("http://localhost:4102" + req.originalUrl.replace("/v2", ""));
  res.status(upstream.status).send(await upstream.text());
});

app.listen(4100, () => console.log("gateway on :4100"));