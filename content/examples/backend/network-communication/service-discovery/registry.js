import express from "express";

const app = express();
app.use(express.json());

const instances = new Map();

app.post("/register", (req, res) => {
  const { service, url } = req.body;
  instances.set(url, { service, url, lastSeen: Date.now() });
  res.json({ ok: true });
});

app.post("/heartbeat", (req, res) => {
  const { url } = req.body;
  const instance = instances.get(url);
  if (instance) instance.lastSeen = Date.now();
  res.json({ ok: true });
});

app.get("/discover/:service", (req, res) => {
  const now = Date.now();
  const list = [];
  instances.forEach((instance) => {
    if (instance.service === req.params.service && now - instance.lastSeen < 5000) {
      list.push(instance.url);
    }
  });
  res.json({ instances: list });
});

app.listen(4800, () => console.log("registry on :4800"));