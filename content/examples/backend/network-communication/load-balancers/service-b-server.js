import express from "express";
const app = express();

app.get("/health", (req, res) => res.send("ok"));
app.get("/api/items", (req, res) => res.json({ source: "B", items: [4, 5, 6] }));

app.listen(5002, () => console.log("service B on :5002"));