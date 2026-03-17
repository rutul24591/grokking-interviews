/**
 * File: scenario.js
 * What it does: Declares the topic focus and tunable knobs for this example.
 */
module.exports = {
  topic: 'forward-proxy',
  title: 'Forward Proxy',
  focus: 'Outbound proxy routing and policy enforcement.',
  behavior: 'Outbound proxy routing and policy enforcement.',
  knobs: {
    simulateLatencyMs: 120,
    sampleSize: 20,
  },
};
