const express = require('express');
const app = express();
app.use(express.json());
const services = {};

app.post('/register', (req, res) => {
  const { name, url } = req.body;
  services[name] = services[name] || [];
  services[name].push(url);
  res.json({ ok: true });
});

app.get('/discover/:name', (req, res) => {
  res.json(services[req.params.name] || []);
});

app.listen(4000);