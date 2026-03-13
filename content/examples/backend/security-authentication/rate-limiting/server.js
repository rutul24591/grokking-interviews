const express = require('express');
const { allow } = require('./limiter');
const app = express();

app.get('/api', (req, res) => {
  if (!allow()) return res.status(429).json({ error: 'rate limited' });
  res.json({ ok: true });
});

app.listen(3000);