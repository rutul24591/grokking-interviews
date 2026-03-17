const express = require('express');
const app = express();
let role = process.env.ROLE || 'standby';

app.get('/health', (req, res) => res.json({ ok: true, role }));
app.post('/promote', (req, res) => { role = 'primary'; res.json({ ok: true }); });

app.listen(8080);