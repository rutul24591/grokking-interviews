const axios = require('axios');
const config = require('./config.json');

async function routeRequest(path) {
  for (const zone of config.zones) {
    for (const instance of zone.instances) {
      try {
        const res = await axios.get(instance + path, { timeout: config.health.timeoutMs });
        return res.data;
      } catch (err) {
        // try next instance
      }
    }
  }
  throw new Error('no healthy instances');
}

module.exports = { routeRequest };