const express = require('express');
const app = express();

app.get('/profile', (req, res) => {
  if (!req.headers.authorization) return res.status(401).json({ error: 'missing token' });
  res.json({ id: 'u1' });
});

app.listen(5000);