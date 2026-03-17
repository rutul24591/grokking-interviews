import express from "express";
import fetch from "node-fetch";
import { verifyToken } from "./token.js";
import { allowRequest } from "./rateLimit.js";
import { routeFor } from "./routes.js";

const app = express();
app.use(express.json());

app.use((req, res, next) => {
  const auth = req.headers.authorization || "";
  const token = auth.replace("Bearer ", "");
  const user = verifyToken(token);
  if (!user) {
    res.status(401).json({ error: "invalid_token" });
    return;
  }
  req.user = user;
  next();
});

app.use((req, res, next) => {
  const key = "user:" + req.user.id;
  if (!allowRequest(key)) {
    res.status(429).json({ error: "rate_limited" });
    return;
  }
  next();
});

app.all("/api/*", async (req, res) => {
  const route = routeFor(req.path);
  if (!route) {
    res.status(404).json({ error: "unknown_route" });
    return;
  }

  const upstreamUrl = route.target + req.originalUrl.replace("/api", "");
  const upstream = await fetch(upstreamUrl, {
    method: req.method,
    headers: {
      "content-type": "application/json",
      "x-user-id": String(req.user.id),
    },
    body: req.method === "GET" ? undefined : JSON.stringify(req.body),
  });

  const body = await upstream.text();
  res.status(upstream.status).send(body);
});

app.listen(3000, () => {
  console.log("gateway listening on :3000");
});