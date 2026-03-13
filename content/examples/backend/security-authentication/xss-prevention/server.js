const express = require('express');
const app = express();
app.use(express.urlencoded({ extended: false }));

function escapeHtml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

app.post('/comment', (req, res) => {
  const safe = escapeHtml(req.body.comment || '');
  res.send('<p>' + safe + '</p>');
});

app.listen(3000);