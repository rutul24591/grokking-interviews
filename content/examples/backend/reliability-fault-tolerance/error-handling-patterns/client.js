const axios = require('axios');
const policy = require('./error-policy.json');

async function getBalance(id) {
  try {
    const res = await axios.get('http://billing:4000/balance/' + id);
    return res.data;
  } catch (err) {
    if (policy.errors.persistent.fallback) {
      return { balance: 'stale', source: 'cache' };
    }
    throw err;
  }
}

getBalance('u1');