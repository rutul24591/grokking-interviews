const axios = require('axios');

async function createOrder(total, key) {
  return axios.post('http://localhost:3000/orders', { total }, { headers: { 'Idempotency-Key': key } });
}

createOrder(25, 'key-123');