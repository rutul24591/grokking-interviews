const fetch = require('node-fetch');
async function lookup() {
  const res = await fetch('http://localhost:4100/discover/api');
  console.log(await res.json());
}
lookup();