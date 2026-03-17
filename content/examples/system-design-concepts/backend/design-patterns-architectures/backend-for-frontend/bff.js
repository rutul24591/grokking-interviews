const express = require('express');
const app = express();
app.get('/mobile/home', (req, res) => {
  res.json({ cards: [] });
});
app.listen(3000);