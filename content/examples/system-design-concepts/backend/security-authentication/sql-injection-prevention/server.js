const express = require('express');
const { getUser } = require('./db');
const app = express();

app.get('/users/:id', async (req, res) => {
  const user = await getUser(req.params.id);
  res.json(user);
});

app.listen(3000);