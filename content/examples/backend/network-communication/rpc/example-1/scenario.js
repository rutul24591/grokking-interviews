/**
 * File: scenario.js
 * What it does: Declares the topic focus and tunable knobs for this example.
 */
module.exports = {
  topic: 'rpc',
  title: 'Rpc',
  focus: 'RPC latency and error rate across services.',
  behavior: 'RPC latency and error rate across services.',
  knobs: {
    simulateLatencyMs: 120,
    sampleSize: 20,
  },
};
