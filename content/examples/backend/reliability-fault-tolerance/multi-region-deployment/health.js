const express = require('express');
const app = express();
app.get('/health', (req, res) => res.json({ ok: true, region: process.env.REGION }));
app.listen(3000);