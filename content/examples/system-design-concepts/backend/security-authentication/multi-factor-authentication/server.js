const express = require('express');
const { verifyToken } = require('./verify');
const app = express();
app.use(express.json());

app.post('/login', (req, res) => {
  const ok = verifyToken(req.body.secret, req.body.token);
  if (!ok) return res.status(401).json({ error: 'mfa failed' });
  res.json({ ok: true });
});

app.listen(3000);