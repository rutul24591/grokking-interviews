/**
 * File: scenario.js
 * What it does: Declares the topic focus and tunable knobs for this example.
 */
module.exports = {
  topic: 'dashboards',
  title: 'Dashboards',
  focus: 'Dashboard panel refresh and coverage.',
  behavior: 'Dashboard panel refresh and coverage.',
  knobs: {
    simulateLatencyMs: 120,
    sampleSize: 20,
  },
};
