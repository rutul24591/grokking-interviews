/**
 * File: scenario.js
 * What it does: Declares the scenario focus and tunable knobs for the example app.
 */
module.exports = {
  topic: 'read-replicas',
  title: 'Read Replicas',
  focus: 'Full app demonstrating Read Replicas behavior with interactive endpoints.',
  knobs: {
    simulateLatencyMs: 120,
    sampleSize: 20,
  },
};
