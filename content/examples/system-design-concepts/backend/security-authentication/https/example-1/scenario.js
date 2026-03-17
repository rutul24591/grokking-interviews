/**
 * File: scenario.js
 * What it does: Declares the topic focus and tunable knobs for this example.
 */
module.exports = {
  topic: 'https',
  title: 'Https',
  focus: 'HTTPS enforcement and HSTS flag.',
  behavior: 'HTTPS enforcement and HSTS flag.',
  knobs: {
    simulateLatencyMs: 120,
    sampleSize: 20,
  },
};
