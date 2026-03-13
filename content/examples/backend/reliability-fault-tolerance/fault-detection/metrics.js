const express = require('express');
const app = express();
let errors = 0;

app.get('/metrics', (req, res) => {
  res.json({ error_rate: errors / 1000, p95_latency_ms: 350 });
});

app.get('/simulate-error', (req, res) => {
  errors += 1;
  res.status(500).json({ ok: false });
});

app.listen(3000);