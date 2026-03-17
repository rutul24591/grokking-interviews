const express = require('express');
const { authorize } = require('./middleware');
const app = express();

app.get('/orders', authorize, (req, res) => res.json({ ok: true }));

app.listen(3000);