const axios = require('axios');
const config = require('./config.json');

async function pollHealth() {
  for (const zone of config.zones) {
    for (const instance of zone.instances) {
      try {
        await axios.get(instance + config.health.path, { timeout: config.health.timeoutMs });
      } catch (err) {
        console.log('Unhealthy', instance);
      }
    }
  }
}

setInterval(pollHealth, 1000);