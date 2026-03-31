import express from "express";

const app = express();
let revision = 0;

app.get("/status", (_req, res) => {
  revision += 1;
  res.json({ revision, status: revision % 2 === 0 ? "indexed" : "processing" });
});

app.listen(Number(process.env.PORT || 4440), () => {
  console.log("Short polling API on http://localhost:4440");
});
