const express = require('express');
const { apiKeyAuth } = require('./middleware');
const app = express();

app.get('/data', apiKeyAuth, (req, res) => res.json({ ok: true }));

app.listen(3000);