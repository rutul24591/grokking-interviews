const express = require('express');
const app = express();

app.get('/authorize', (req, res) => {
  const code = 'auth-code-1';
  res.redirect(req.query.redirect_uri + '?code=' + code);
});

app.post('/token', (req, res) => {
  res.json({ access_token: 'token-abc', token_type: 'bearer' });
});

app.listen(4000);