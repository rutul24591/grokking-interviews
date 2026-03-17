/**
 * File: scenario.js
 * What it does: Declares the scenario focus and tunable knobs for the example app.
 */
module.exports = {
  topic: 'transaction-isolation-levels',
  title: 'Transaction Isolation Levels',
  focus: 'Full app demonstrating Transaction Isolation Levels behavior with interactive endpoints.',
  knobs: {
    simulateLatencyMs: 120,
    sampleSize: 20,
  },
};
