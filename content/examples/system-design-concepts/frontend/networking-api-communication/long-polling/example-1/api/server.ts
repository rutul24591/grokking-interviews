import express from "express";

type FeedEvent = {
  id: number;
  message: string;
  createdAt: string;
};

const app = express();
app.use(express.json());

let events: FeedEvent[] = [];
let nextId = 1;
let waiters: Array<(event: FeedEvent | null) => void> = [];

app.get("/poll", async (req, res) => {
  const cursor = Number(req.query.cursor || 0);
  const available = events.filter((event) => event.id > cursor);
  if (available.length > 0) {
    return res.json({ items: available, cursor: available[available.length - 1].id, timeout: false });
  }

  const result = await new Promise<FeedEvent | null>((resolve) => {
    const timeout = setTimeout(() => {
      waiters = waiters.filter((item) => item !== handler);
      resolve(null);
    }, 6000);

    const handler = (event: FeedEvent | null) => {
      clearTimeout(timeout);
      resolve(event);
    };

    waiters.push(handler);
  });

  if (!result) {
    return res.json({ items: [], cursor, timeout: true });
  }

  return res.json({ items: [result], cursor: result.id, timeout: false });
});

app.post("/events", (req, res) => {
  const event: FeedEvent = {
    id: nextId++,
    message: String(req.body.message || "Untitled event"),
    createdAt: new Date().toLocaleTimeString()
  };
  events = [event, ...events].slice(0, 20);
  for (const waiter of waiters) {
    waiter(event);
  }
  waiters = [];
  res.status(201).json(event);
});

app.listen(Number(process.env.PORT || 4360), () => {
  console.log("Long polling API on http://localhost:4360");
});
