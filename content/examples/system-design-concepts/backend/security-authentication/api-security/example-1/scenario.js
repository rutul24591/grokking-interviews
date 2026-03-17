/**
 * File: scenario.js
 * What it does: Declares the topic focus and tunable knobs for this example.
 */
module.exports = {
  topic: 'api-security',
  title: 'Api Security',
  focus: 'Input validation + rate limit gate.',
  behavior: 'Input validation + rate limit gate.',
  knobs: {
    simulateLatencyMs: 120,
    sampleSize: 20,
  },
};
