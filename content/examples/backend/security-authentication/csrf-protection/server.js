const express = require('express');
const { token } = require('./csrf');
const app = express();
app.use(express.urlencoded({ extended: false }));

app.get('/form', (req, res) => {
  const t = token();
  res.setHeader('Set-Cookie', 'csrf=' + t + '; HttpOnly');
  res.send('<form method="POST"><input name="csrf" value="' + t + '" /></form>');
});

app.post('/submit', (req, res) => {
  if (req.body.csrf !== (req.headers.cookie || '').replace('csrf=', '')) {
    return res.status(403).send('bad token');
  }
  res.send('ok');
});

app.listen(3000);