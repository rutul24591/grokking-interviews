const express = require('express');
const { apm } = require('./apm');
const app = express();
app.use(apm);
app.get('/api', (req, res) => res.json({ ok: true }));
app.listen(3000);