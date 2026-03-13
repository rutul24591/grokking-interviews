const express = require('express');
const { getTrace } = require('./trace');
const app = express();

app.get('/c', (req, res) => {
  res.json({ trace: getTrace(req), ok: true });
});

app.listen(3012);