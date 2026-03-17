/**
 * File: scenario.js
 * What it does: Declares the topic focus and tunable knobs for this example.
 */
module.exports = {
  topic: 'canary-deployment',
  title: 'Canary Deployment',
  focus: 'Full app demonstrating Canary Deployment behavior with interactive endpoints.',
  behavior: 'Full app demonstrating Canary Deployment behavior with interactive endpoints.',
  knobs: {
    simulateLatencyMs: 120,
    sampleSize: 20,
  },
};
