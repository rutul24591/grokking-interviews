import express from "express";

const app = express();
let mounts = 0;
let cleanups = 0;
let polls = 0;

app.use((_, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  next();
});
app.options("*", (_, res) => res.sendStatus(204));

app.post("/widget/mount", (_, res) => {
  mounts += 1;
  res.json({ ok: true });
});
app.post("/widget/poll", (_, res) => {
  polls += 1;
  res.json({ ok: true });
});
app.post("/widget/cleanup", (_, res) => {
  cleanups += 1;
  res.json({ ok: true });
});
app.get("/widget/status", (_, res) => {
  res.json({
    mounts,
    cleanups,
    polls,
    notes: [
      cleanups < mounts ? "A widget is still mounted and doing work." : "Cleanup count matches mounts.",
      "Intervals, subscriptions, and observers should be released on unmount.",
      "Async completions after unmount need cancellation guards."
    ]
  });
});

app.listen(4523, () => {
  console.log("Lifecycle optimization API on http://localhost:4523");
});
