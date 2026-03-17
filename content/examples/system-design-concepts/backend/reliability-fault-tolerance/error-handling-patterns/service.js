const express = require('express');
const app = express();

app.get('/balance/:id', (req, res) => {
  res.status(503).json({ error: 'billing_down' });
});

app.listen(4000);