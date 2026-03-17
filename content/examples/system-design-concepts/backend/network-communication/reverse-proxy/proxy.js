import express from "express";
import fetch from "node-fetch";
import { cacheGet, cacheSet } from "./cache.js";

const app = express();

app.get("/static/*", async (req, res) => {
  const cached = cacheGet(req.originalUrl);
  if (cached) {
    res.set("x-cache", "hit").send(cached);
    return;
  }
  const upstream = await fetch("http://localhost:4601" + req.originalUrl);
  const body = await upstream.text();
  cacheSet(req.originalUrl, body);
  res.set("x-cache", "miss").send(body);
});

app.all("/api/*", async (req, res) => {
  const upstream = await fetch("http://localhost:4602" + req.originalUrl);
  const body = await upstream.text();
  res.set("x-proxied-by", "reverse-proxy");
  res.status(upstream.status).send(body);
});

app.listen(4600, () => console.log("reverse proxy on :4600"));