const express = require('express');
const { can } = require('./authz');
const app = express();

app.delete('/admin/users/:id', (req, res) => {
  const role = req.headers['x-role'] || 'user';
  if (!can(role, 'delete')) return res.status(403).json({ error: 'forbidden' });
  res.json({ ok: true });
});

app.listen(3000);