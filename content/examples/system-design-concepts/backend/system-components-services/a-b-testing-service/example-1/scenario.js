/**
 * File: scenario.js
 * What it does: Declares the topic focus and tunable knobs for this example.
 */
module.exports = {
  topic: 'a-b-testing-service',
  title: 'A B Testing Service',
  focus: 'Full app demonstrating A B Testing Service behavior with interactive endpoints.',
  behavior: 'Full app demonstrating A B Testing Service behavior with interactive endpoints.',
  knobs: {
    simulateLatencyMs: 120,
    sampleSize: 20,
  },
};
