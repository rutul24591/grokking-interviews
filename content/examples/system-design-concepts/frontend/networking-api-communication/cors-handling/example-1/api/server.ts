import express from "express";

const app = express();
app.use(express.json());

const allowedOrigin = "http://localhost:3000";

app.use((req, res, next) => {
  if (req.path === "/allowed" && req.headers.origin === allowedOrigin) {
    res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  }

  if (req.method === "OPTIONS") {
    return res.status(req.path === "/allowed" ? 204 : 403).end();
  }

  next();
});

app.post("/allowed", (_req, res) => {
  res.json({
    message: "cross-origin request accepted",
    preflightRequired: true,
    credentialMode: "include"
  });
});

app.post("/blocked", (_req, res) => {
  res.json({
    message: "response exists but the browser must hide it because CORS headers are missing"
  });
});

app.listen(Number(process.env.PORT || 4330), () => console.log("CORS demo API on http://localhost:4330"));
