import express from "express";
const app = express();

app.get("/api/status", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(4602, () => console.log("api service on :4602"));