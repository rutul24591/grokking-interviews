/**
 * File: scenario.js
 * What it does: Declares the topic focus and tunable knobs for this example.
 */
module.exports = {
  topic: 'tls-ssl',
  title: 'Tls Ssl',
  focus: 'TLS version policy acceptance.',
  behavior: 'TLS version policy acceptance.',
  knobs: {
    simulateLatencyMs: 120,
    sampleSize: 20,
  },
};
