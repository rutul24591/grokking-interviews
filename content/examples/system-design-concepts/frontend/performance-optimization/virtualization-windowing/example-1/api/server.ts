import express from "express";
const app = express();
app.get("/health", (_req, res) => res.json({ ok: true }));
app.listen(Number(process.env.PORT || 4240), () => console.log("Virtualization API on http://localhost:4240"));
