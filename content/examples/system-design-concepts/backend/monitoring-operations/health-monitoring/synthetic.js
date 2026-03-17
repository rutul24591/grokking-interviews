const axios = require('axios');

async function check() {
  const res = await axios.get('http://localhost:3000/health');
  if (res.status !== 200) throw new Error('bad health');
}

setInterval(check, 60000);