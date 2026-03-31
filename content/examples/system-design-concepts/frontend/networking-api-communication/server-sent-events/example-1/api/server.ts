import express from "express";

const app = express();

app.get("/events", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  let count = 0;
  const interval = setInterval(() => {
    count += 1;
    res.write(`data: article update ${count}\n\n`);
    if (count === 5) {
      clearInterval(interval);
    }
  }, 400);

  req.on("close", () => {
    clearInterval(interval);
  });
});

app.listen(Number(process.env.PORT || 4430), () => {
  console.log("SSE API on http://localhost:4430");
});
