const express = require('express');
const app = express();
let restarts = 0;
app.get('/metrics', (req, res) => res.json({ restarts }));
app.listen(3001);