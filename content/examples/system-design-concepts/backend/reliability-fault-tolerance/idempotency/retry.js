const axios = require('axios');

async function retryOrder(total, key) {
  try {
    await axios.post('http://localhost:3000/orders', { total }, { headers: { 'Idempotency-Key': key } });
  } catch {
    // safe to retry with same key
    await axios.post('http://localhost:3000/orders', { total }, { headers: { 'Idempotency-Key': key } });
  }
}

retryOrder(25, 'key-123');