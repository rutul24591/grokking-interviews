import express from "express";

const app = express();
app.use(express.json());

app.post("/collect", (req, res) => {
  const events = Array.isArray(req.body.events) ? req.body.events : [];
  res.json({ accepted: events.length });
});

app.listen(Number(process.env.PORT || 4471), () => {
  console.log("Analytics collector on http://localhost:4471");
});
