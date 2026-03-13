/**
 * File: scenario.js
 * What it does: Declares the topic focus and tunable knobs for this example.
 */
module.exports = {
  topic: 'rollback-strategies',
  title: 'Rollback Strategies',
  focus: 'Rollback vs rollforward based on error rate.',
  behavior: 'Rollback vs rollforward based on error rate.',
  knobs: {
    simulateLatencyMs: 120,
    sampleSize: 20,
  },
};
