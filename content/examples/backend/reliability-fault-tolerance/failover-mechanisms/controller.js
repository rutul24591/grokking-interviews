const axios = require('axios');
const config = require('./config.json');

async function checkHealth(host) {
  try {
    await axios.get('http://' + host + ':8080/health', { timeout: config.health.timeoutMs });
    return true;
  } catch {
    return false;
  }
}

async function promote() {
  await axios.post('http://' + config.standby + ':8080/promote', { lease: config.leaseSeconds });
  await axios.post(config.routing.endpoint, { primary: config.standby });
}

async function loop() {
  const ok = await checkHealth(config.primary);
  if (!ok) await promote();
}

setInterval(loop, config.health.intervalMs);