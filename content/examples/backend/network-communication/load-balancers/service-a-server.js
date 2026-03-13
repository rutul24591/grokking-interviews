import express from "express";
const app = express();

app.get("/health", (req, res) => res.send("ok"));
app.get("/api/items", (req, res) => res.json({ source: "A", items: [1, 2, 3] }));

app.listen(5001, () => console.log("service A on :5001"));