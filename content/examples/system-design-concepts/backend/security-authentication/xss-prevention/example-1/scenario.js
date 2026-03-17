/**
 * File: scenario.js
 * What it does: Declares the topic focus and tunable knobs for this example.
 */
module.exports = {
  topic: 'xss-prevention',
  title: 'Xss Prevention',
  focus: 'Output encoding pass/fail.',
  behavior: 'Output encoding pass/fail.',
  knobs: {
    simulateLatencyMs: 120,
    sampleSize: 20,
  },
};
