/**
 * File: scenario.js
 * What it does: Declares the topic focus and tunable knobs for this example.
 */
module.exports = {
  topic: 'health-checks',
  title: 'Health Checks',
  focus: 'Liveness vs readiness routing effects.',
  behavior: 'Liveness vs readiness routing effects.',
  knobs: {
    simulateLatencyMs: 120,
    sampleSize: 20,
  },
};
