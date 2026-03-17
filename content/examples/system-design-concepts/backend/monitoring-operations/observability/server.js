const express = require('express');
const { log, metric } = require('./telemetry');
const app = express();

app.get('/checkout', (req, res) => {
  const trace = req.headers['x-trace-id'] || 't-' + Date.now();
  log('checkout_start', { trace });
  metric();
  log('checkout_end', { trace });
  res.json({ ok: true });
});

app.listen(3000);