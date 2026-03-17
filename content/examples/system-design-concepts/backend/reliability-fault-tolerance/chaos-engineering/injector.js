const axios = require('axios');
const config = require('./chaos-config.json');

async function injectLatency() {
  await axios.post(config.target + '/chaos/latency', { delayMs: config.injectLatencyMs });
}

injectLatency();