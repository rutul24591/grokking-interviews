import express from "express";

const app = express();
app.use(express.json());

const articles = {
  queueing: { id: "queueing", title: "Request Queueing in the Browser", readingTime: "8 min read" },
  websocket: { id: "websocket", title: "WebSocket Session Management", readingTime: "10 min read" },
  cdn: { id: "cdn", title: "CDN Edge Caching Fundamentals", readingTime: "7 min read" },
  graphql: { id: "graphql", title: "GraphQL Query Planning", readingTime: "11 min read" }
} as const;

app.post("/articles/batch", async (req, res) => {
  await new Promise((resolve) => setTimeout(resolve, 150));
  const ids = Array.isArray(req.body.ids) ? req.body.ids : [];
  const items = ids.flatMap((id: keyof typeof articles) => (articles[id] ? [articles[id]] : []));
  res.json({ items, requestedAt: new Date().toLocaleTimeString() });
});

app.listen(Number(process.env.PORT || 4380), () => {
  console.log("Request batching API on http://localhost:4380");
});
