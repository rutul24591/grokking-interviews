import express from "express";
const app = express();

app.get("/stream", (req, res) => {
  res.set({
    "content-type": "text/event-stream",
    "cache-control": "no-cache",
    connection: "keep-alive",
  });

  const heartbeat = setInterval(() => {
    res.write(": heartbeat\\n\\n");
  }, 10000);

  const metrics = setInterval(() => {
    const payload = JSON.stringify({ cpu: Math.random(), mem: Math.random() });
    res.write("data: " + payload + "\\n\\n");
  }, 1000);

  req.on("close", () => {
    clearInterval(heartbeat);
    clearInterval(metrics);
  });
});

app.listen(5300, () => console.log("sse server on :5300"));