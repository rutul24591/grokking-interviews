const fetch = require('node-fetch');
async function discover() {
  const res = await fetch('http://localhost:4000/discover/payments');
  const urls = await res.json();
  console.log(urls[0]);
}
discover();