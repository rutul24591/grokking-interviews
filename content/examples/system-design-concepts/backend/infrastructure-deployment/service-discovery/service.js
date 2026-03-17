const fetch = require('node-fetch');
fetch('http://localhost:4000/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'payments', url: 'http://10.0.1.3:5000' })
});