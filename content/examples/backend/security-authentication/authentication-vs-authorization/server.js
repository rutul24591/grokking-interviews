const express = require('express');
const { authenticate } = require('./auth');
const { authorize } = require('./authorize');

const app = express();
app.get('/docs/:id', (req, res) => {
  const user = authenticate(req);
  authorize(user, 'read');
  res.json({ id: req.params.id, content: 'doc' });
});

app.listen(3000);