const axios = require('axios');

async function checkSlo() {
  const res = await axios.get('http://api:3000/metrics');
  const errorRate = res.data.errorRate;
  if (errorRate > 0.02) {
    console.log('abort experiment');
  }
}

setInterval(checkSlo, 5000);