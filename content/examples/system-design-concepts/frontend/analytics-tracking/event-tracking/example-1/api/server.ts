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

const allowed = new Set(["scroll_depth", "share_click", "bookmark", "comment_open"]);

app.post("/collect", (req, res) => {
  const events = Array.isArray(req.body?.events) ? req.body.events : [];
  const accepted: string[] = [];
  const rejected: string[] = [];

  for (const event of events) {
    if (!allowed.has(event.type)) {
      rejected.push(`${event.type} rejected because the contract does not define it`);
      continue;
    }
    accepted.push(`${event.type} accepted for ${event.articleId}`);
  }

  res.json({ accepted, rejected });
});

app.listen(4514, () => {
  console.log("Event tracking API on http://localhost:4514");
});
