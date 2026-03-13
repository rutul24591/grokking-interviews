const express = require('express');
const flags = require('./flags.json');
const app = express();

app.post('/checkout', (req, res) => {
  if (flags.checkoutV2) {
    return res.json({ flow: 'v2' });
  }
  res.json({ flow: 'v1' });
});

app.listen(3000);