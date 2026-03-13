import express from "express";
const app = express();

app.get("/stats", (req, res) => {
  setTimeout(() => res.json({ projects: 4, alerts: 1 }), 200);
});

app.listen(4402, () => console.log("stats on :4402"));