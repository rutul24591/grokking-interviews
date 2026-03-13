const fetch = require('node-fetch');
fetch('http://localhost:4100/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'api', url: 'http://10.0.0.5:3000', ttl: 30000 })
});