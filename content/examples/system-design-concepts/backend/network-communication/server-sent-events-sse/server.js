const express = require('express');
const app = express();

app.get('/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  let id = 0;
  const timer = setInterval(() => {
    res.write('id: ' + id + '\n');
    res.write('data: update-' + id + '\n\n');
    id += 1;
  }, 1000);
  req.on('close', () => clearInterval(timer));
});

app.listen(3000);