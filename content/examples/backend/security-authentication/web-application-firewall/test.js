const fetch = require('node-fetch');
fetch('http://localhost:3000/api/search', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ q: '<script>alert(1)</script>' })
}).then(res => console.log(res.status));