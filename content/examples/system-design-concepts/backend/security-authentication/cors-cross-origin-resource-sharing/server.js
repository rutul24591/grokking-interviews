const express = require('express');
const app = express();
const cfg = require('./cors-config.json');

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (cfg.allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');
  }
  next();
});

app.get('/data', (req, res) => res.json({ ok: true }));

app.listen(3000);