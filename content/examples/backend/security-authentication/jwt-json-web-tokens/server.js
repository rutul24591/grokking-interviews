const express = require('express');
const { verify } = require('./verify');
const app = express();

app.get('/secure', (req, res) => {
  const token = req.headers.authorization || '';
  const claims = verify(token.replace('Bearer ', ''));
  res.json({ ok: true, user: claims.sub });
});

app.listen(3000);