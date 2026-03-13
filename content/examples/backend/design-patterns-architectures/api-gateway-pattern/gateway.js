const express = require('express');
const app = express();
app.get('/dashboard', async (req, res) => {
  res.json({ user: {}, orders: [] });
});
app.listen(3000);