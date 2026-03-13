/**
 * File: scenario.js
 * What it does: Declares the topic focus and tunable knobs for this example.
 */
module.exports = {
  topic: 'change-data-capture',
  title: 'Change Data Capture',
  focus: 'CDC stream lag and event ordering.',
  behavior: 'CDC stream lag and event ordering.',
  knobs: {
    simulateLatencyMs: 120,
    sampleSize: 20,
  },
};
