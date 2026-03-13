/**
 * File: scenario.js
 * What it does: Declares the topic focus and tunable knobs for this example.
 */
module.exports = {
  topic: 'security-headers',
  title: 'Security Headers',
  focus: 'Response security header summary.',
  behavior: 'Response security header summary.',
  knobs: {
    simulateLatencyMs: 120,
    sampleSize: 20,
  },
};
