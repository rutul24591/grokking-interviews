const express = require('express');
const { allow } = require('./evaluator');
const app = express();

app.get('/docs/:id', (req, res) => {
  const user = { department: req.headers['x-dept'] || 'sales' };
  const doc = { department: 'sales' };
  if (!allow(user, doc)) return res.status(403).json({ error: 'forbidden' });
  res.json({ ok: true });
});

app.listen(3000);