/**
 * File: scenario.js
 * What it does: Declares the topic focus and tunable knobs for this example.
 */
module.exports = {
  topic: 'retry-mechanisms',
  title: 'Retry Mechanisms',
  focus: 'Retry policy impact on success and load.',
  behavior: 'Retry policy impact on success and load.',
  knobs: {
    simulateLatencyMs: 120,
    sampleSize: 20,
  },
};
