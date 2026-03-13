const express = require('express');
const { record, snapshot } = require('./metrics');
const app = express();

app.get('/checkout', (req, res) => {
  record(true);
  res.json({ ok: true });
});

app.get('/metrics', (req, res) => {
  res.json(snapshot());
});

app.listen(3000);