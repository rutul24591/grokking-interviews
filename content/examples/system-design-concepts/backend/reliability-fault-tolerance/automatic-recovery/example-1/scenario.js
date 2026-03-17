/**
 * File: scenario.js
 * What it does: Declares the topic focus and tunable knobs for this example.
 */
module.exports = {
  topic: 'automatic-recovery',
  title: 'Automatic Recovery',
  focus: 'Restart loop with backoff and readiness gate.',
  behavior: 'Restart loop with backoff and readiness gate.',
  knobs: {
    simulateLatencyMs: 120,
    sampleSize: 20,
  },
};
