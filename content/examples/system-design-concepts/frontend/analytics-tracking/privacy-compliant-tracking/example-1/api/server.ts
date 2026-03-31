import crypto from "node:crypto";
import express from "express";

const app = express();
app.use(express.json());
app.use((_, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  next();
});
app.options("*", (_, res) => res.sendStatus(204));

function sanitize(payload: Record<string, string>) {
  return {
    article: payload.article,
    country: payload.country,
    sessionHash: crypto.createHash("sha256").update(payload.sessionId).digest("hex").slice(0, 16),
    email: "[redacted]"
  };
}

app.post("/collect", (req, res) => {
  const received = {
    article: String(req.body?.article ?? ""),
    email: String(req.body?.email ?? ""),
    sessionId: String(req.body?.sessionId ?? ""),
    country: String(req.body?.country ?? "")
  };
  res.json({ received, sanitized: sanitize(received) });
});

app.listen(4516, () => {
  console.log("Privacy tracking API on http://localhost:4516");
});
