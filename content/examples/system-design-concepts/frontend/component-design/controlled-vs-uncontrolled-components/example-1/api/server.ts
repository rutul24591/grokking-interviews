import express from "express";

const app = express();
app.use(express.json());
app.use((_, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  next();
});
app.options("*", (_, res) => res.sendStatus(204));

const submissions: { mode: string; title: string; note: string }[] = [];

app.post("/submit", (req, res) => {
  const entry = {
    mode: String(req.body?.mode ?? "unknown"),
    title: String(req.body?.title ?? ""),
    note: String(req.body?.note ?? "")
  };
  submissions.unshift(entry);
  res.json({ submissions: submissions.slice(0, 8) });
});

app.listen(4525, () => {
  console.log("Controlled/uncontrolled API on http://localhost:4525");
});
