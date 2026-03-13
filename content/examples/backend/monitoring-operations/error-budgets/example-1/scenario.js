/**
 * File: scenario.js
 * What it does: Declares the topic focus and tunable knobs for this example.
 */
module.exports = {
  topic: 'error-budgets',
  title: 'Error Budgets',
  focus: 'Error budget consumption and burn rate.',
  behavior: 'Error budget consumption and burn rate.',
  knobs: {
    simulateLatencyMs: 120,
    sampleSize: 20,
  },
};
