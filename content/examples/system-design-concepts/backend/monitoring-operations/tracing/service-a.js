const express = require('express');
const axios = require('axios');
const { traceId } = require('./trace');
const app = express();

app.get('/a', async (req, res) => {
  const id = traceId(req);
  const resp = await axios.get('http://service-b/b', { headers: { 'x-trace-id': id } });
  res.json({ trace: id, data: resp.data });
});

app.listen(3001);