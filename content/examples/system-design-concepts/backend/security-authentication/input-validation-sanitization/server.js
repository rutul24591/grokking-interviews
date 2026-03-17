const express = require('express');
const { sanitize } = require('./sanitize');
const app = express();
app.use(express.json());

app.post('/signup', (req, res) => {
  const email = sanitize(req.body.email || '');
  if (!email.includes('@')) return res.status(400).json({ error: 'bad email' });
  res.json({ ok: true });
});

app.listen(3000);