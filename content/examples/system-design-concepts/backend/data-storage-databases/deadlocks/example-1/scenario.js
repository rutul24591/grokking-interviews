/**
 * File: scenario.js
 * What it does: Declares the scenario focus and tunable knobs for the example app.
 */
module.exports = {
  topic: 'deadlocks',
  title: 'Deadlocks',
  focus: 'Full app demonstrating Deadlocks behavior with interactive endpoints.',
  knobs: {
    simulateLatencyMs: 120,
    sampleSize: 20,
  },
};
