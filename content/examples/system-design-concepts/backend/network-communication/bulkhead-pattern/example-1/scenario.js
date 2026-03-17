/**
 * File: scenario.js
 * What it does: Declares the topic focus and tunable knobs for this example.
 */
module.exports = {
  topic: 'bulkhead-pattern',
  title: 'Bulkhead Pattern',
  focus: 'Isolating failures via resource pools.',
  behavior: 'Isolating failures via resource pools.',
  knobs: {
    simulateLatencyMs: 120,
    sampleSize: 20,
  },
};
