import express from "express";

const app = express();
app.use(express.json());

let params = { query: "router", sort: "relevance", page: "1", tags: ["frontend", "navigation"] };
const logs = ["Parsed initial search params from the URL."];

app.use((_, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  next();
});
app.options("*", (_, res) => res.sendStatus(204));

app.get("/state", (_, res) => res.json({ params, logs: logs.slice(0, 8) }));
app.post("/apply", (req, res) => {
  params = {
    query: String(req.body?.query ?? params.query),
    sort: String(req.body?.sort ?? params.sort),
    page: String(req.body?.page ?? params.page),
    tags: Array.isArray(req.body?.tags) ? req.body.tags.map((value: string) => String(value)) : params.tags
  };
  logs.unshift(`Canonicalized ?query=${params.query}&sort=${params.sort}&page=${params.page}&tags=${params.tags.join(",")}.`);
  res.json({ ok: true });
});

app.listen(4549, () => console.log("URL params API on http://localhost:4549"));
