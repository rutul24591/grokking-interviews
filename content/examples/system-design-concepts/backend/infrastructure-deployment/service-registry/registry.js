const express = require('express');
const app = express();
app.use(express.json());
const services = {};

app.post('/register', (req, res) => {
  const { name, url, ttl } = req.body;
  services[name] = services[name] || [];
  services[name].push({ url, expires: Date.now() + ttl });
  res.json({ ok: true });
});

app.get('/discover/:name', (req, res) => {
  const now = Date.now();
  services[req.params.name] = (services[req.params.name] || []).filter(s => s.expires > now);
  res.json(services[req.params.name].map(s => s.url));
});

app.listen(4100);