import express from "express";

const app = express();
app.use((_, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

app.get("/articles", (_, res) => {
  res.json([
    { title: "Streaming SSR", category: "frontend" },
    { title: "Token Buckets", category: "backend" },
    { title: "Resource Hints", category: "frontend" }
  ]);
});

app.listen(4528, () => {
  console.log("Smart/dumb API on http://localhost:4528");
});
