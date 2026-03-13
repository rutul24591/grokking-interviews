/**
 * File: scenario.js
 * What it does: Declares the scenario focus and tunable knobs for the example app.
 */
module.exports = {
  topic: 'concurrency-control',
  title: 'Concurrency Control',
  focus: 'Full app demonstrating Concurrency Control behavior with interactive endpoints.',
  knobs: {
    simulateLatencyMs: 120,
    sampleSize: 20,
  },
};
