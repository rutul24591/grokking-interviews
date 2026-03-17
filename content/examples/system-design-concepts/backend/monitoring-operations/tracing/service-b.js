const express = require('express');
const { traceId } = require('./trace');
const app = express();

app.get('/b', (req, res) => {
  res.json({ trace: traceId(req), ok: true });
});

app.listen(3002);