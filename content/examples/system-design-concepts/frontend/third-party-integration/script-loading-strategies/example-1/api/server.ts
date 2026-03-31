import express from "express";

const app = express();

const delays = {
  eager: 0,
  defer: 120,
  idle: 600,
  interaction: 900
} as const;

app.get("/scripts/bootstrap", async (req, res) => {
  const strategy = String(req.query.strategy || "defer") as keyof typeof delays;
  const startedAfterMs = delays[strategy] ?? delays.defer;
  await new Promise((resolve) => setTimeout(resolve, 50));
  res.json({ strategy, startedAfterMs, script: strategy === "eager" ? "fraud-check.js" : strategy === "interaction" ? "chat.js" : "analytics.js" });
});

app.listen(Number(process.env.PORT || 4475), () => {
  console.log("Script loading API on http://localhost:4475");
});
