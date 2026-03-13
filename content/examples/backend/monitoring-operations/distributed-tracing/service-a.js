const express = require('express');
const axios = require('axios');
const { getTrace } = require('./trace');
const app = express();

app.get('/a', async (req, res) => {
  const t = getTrace(req);
  await axios.get('http://service-b/b', { headers: { 'x-trace-id': t } });
  res.json({ trace: t });
});

app.listen(3010);