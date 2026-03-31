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

const views: { path: string; referrer: string | null; counted: boolean; reason: string }[] = [];
let previousCanonical = "/articles/rendering";

function canonicalize(path: string) {
  return path.split("#")[0].replace(/\?.*$/, "");
}

app.get("/views", (_, res) => {
  res.json({ views: views.slice(0, 8) });
});

app.post("/views", (req, res) => {
  const path = String(req.body?.path ?? "/");
  const canonical = canonicalize(path);
  const counted = canonical !== previousCanonical;
  views.unshift({
    path,
    referrer: typeof req.body?.referrer === "string" ? req.body.referrer : null,
    counted,
    reason: counted ? `counted canonical path ${canonical}` : "suppressed duplicate canonical page view"
  });
  if (counted) previousCanonical = canonical;
  res.json({ activePath: path, views: views.slice(0, 8) });
});

app.listen(4515, () => {
  console.log("Page view API on http://localhost:4515");
});
