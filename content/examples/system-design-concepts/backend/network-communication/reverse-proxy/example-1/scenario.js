/**
 * File: scenario.js
 * What it does: Declares the topic focus and tunable knobs for this example.
 */
module.exports = {
  topic: 'reverse-proxy',
  title: 'Reverse Proxy',
  focus: 'Ingress routing, caching, and TLS termination.',
  behavior: 'Ingress routing, caching, and TLS termination.',
  knobs: {
    simulateLatencyMs: 120,
    sampleSize: 20,
  },
};
