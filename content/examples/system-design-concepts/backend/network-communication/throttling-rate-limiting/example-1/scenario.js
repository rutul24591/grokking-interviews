/**
 * File: scenario.js
 * What it does: Declares the topic focus and tunable knobs for this example.
 */
module.exports = {
  topic: 'throttling-rate-limiting',
  title: 'Throttling Rate Limiting',
  focus: 'Token bucket allow/deny decisions.',
  behavior: 'Token bucket allow/deny decisions.',
  knobs: {
    simulateLatencyMs: 120,
    sampleSize: 20,
  },
};
