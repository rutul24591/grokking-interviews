const express = require('express');
const { log } = require('./logger');
const app = express();

app.use((req, res, next) => {
  req.corrId = req.headers['x-correlation-id'] || 'corr-' + Date.now();
  next();
});

app.get('/orders', (req, res) => {
  log('info', 'fetch_orders', { corrId: req.corrId });
  res.json({ ok: true });
});

app.listen(3000);