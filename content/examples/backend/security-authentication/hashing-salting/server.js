const express = require('express');
const { hashPassword, verifyPassword } = require('./hash');
const app = express();
app.use(express.json());

app.post('/signup', async (req, res) => {
  const hash = await hashPassword(req.body.password);
  res.json({ hash });
});

app.post('/login', async (req, res) => {
  const ok = await verifyPassword(req.body.password, req.body.hash);
  res.json({ ok });
});

app.listen(3000);