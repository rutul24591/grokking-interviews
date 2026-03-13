/**
 * File: scenario.js
 * What it does: Declares the topic focus and tunable knobs for this example.
 */
module.exports = {
  topic: 'graceful-degradation',
  title: 'Graceful Degradation',
  focus: 'Feature flag fallback behavior.',
  behavior: 'Feature flag fallback behavior.',
  knobs: {
    simulateLatencyMs: 120,
    sampleSize: 20,
  },
};
