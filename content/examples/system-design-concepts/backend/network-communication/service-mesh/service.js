import express from "express";
const app = express();

app.get("/data", (req, res) => {
  res.json({ source: "service-b", ok: true });
});

app.listen(4902, () => console.log("service on :4902"));