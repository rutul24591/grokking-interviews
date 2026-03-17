const express = require('express');
const waf = require('./waf');
const app = express();
app.use(express.json());
app.use(waf);

app.post('/api/search', (req, res) => res.json({ ok: true }));
app.listen(3000);