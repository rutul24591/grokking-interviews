/**
 * File: scenario.js
 * What it does: Declares the scenario focus and tunable knobs for the example app.
 */
module.exports = {
  topic: 'tcp-vs-udp',
  title: 'Tcp Vs Udp',
  focus: 'Full app demonstrating Tcp Vs Udp behavior with interactive endpoints.',
  knobs: {
    simulateLatencyMs: 120,
    sampleSize: 20,
  },
};
