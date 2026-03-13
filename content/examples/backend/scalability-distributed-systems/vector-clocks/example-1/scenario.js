/**
 * File: scenario.js
 * What it does: Declares the topic focus and tunable knobs for this example.
 */
module.exports = {
  topic: 'vector-clocks',
  title: 'Vector Clocks',
  focus: 'Causal ordering with concurrent versions.',
  behavior: 'Causal ordering with concurrent versions.',
  knobs: {
    simulateLatencyMs: 120,
    sampleSize: 20,
  },
};
