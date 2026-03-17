const express = require('express');
const app = express();
app.get('/health', (req, res) => res.json({ ok: true }));
app.get('/ping', (req, res) => res.json({ ok: true, instance: process.env.INSTANCE }));
app.listen(3000);