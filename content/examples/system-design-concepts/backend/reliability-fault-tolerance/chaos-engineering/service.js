const express = require('express');
const app = express();
let delayMs = 0;

app.post('/chaos/latency', (req, res) => { delayMs = req.body.delayMs; res.json({ ok: true }); });
app.get('/price/:id', async (req, res) => {
  if (delayMs) await new Promise(r => setTimeout(r, delayMs));
  res.json({ id: req.params.id, price: 10 });
});

app.listen(4001);