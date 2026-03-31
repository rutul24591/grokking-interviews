import express from "express";

const app = express();
app.use(express.json());

const screens = [
  { hash: "#overview", label: "Overview", durability: "Works on static hosts without server rewrites." },
  { hash: "#architecture", label: "Architecture", durability: "Hash state stays client-only." },
  { hash: "#tradeoffs", label: "Tradeoffs", durability: "SEO and analytics need special handling." }
];
let activeHash = "#overview";
const logs = ["Initialized hash router at #overview."];

app.use((_, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  next();
});
app.options("*", (_, res) => res.sendStatus(204));

app.get("/state", (_, res) => res.json({ screens, activeHash, logs: logs.slice(0, 8) }));
app.post("/navigate", (req, res) => {
  activeHash = String(req.body?.hash ?? "#overview");
  logs.unshift(`Updated location hash to ${activeHash} without requesting the origin.`);
  res.json({ ok: true });
});

app.listen(4544, () => console.log("Hash routing API on http://localhost:4544"));
