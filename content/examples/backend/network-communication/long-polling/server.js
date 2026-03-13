import express from "express";
const app = express();

let queue = [];

app.get("/poll", (req, res) => {
  const timer = setTimeout(() => {
    res.json({ events: [] });
  }, 15000);

  if (queue.length > 0) {
    clearTimeout(timer);
    const events = queue;
    queue = [];
    res.json({ events });
  } else {
    const listener = () => {
      clearTimeout(timer);
      const events = queue;
      queue = [];
      res.json({ events });
    };
    app.once("new_event", listener);
  }
});

app.post("/event", express.json(), (req, res) => {
  queue.push(req.body);
  app.emit("new_event");
  res.json({ ok: true });
});

app.listen(5200, () => console.log("long polling server on :5200"));