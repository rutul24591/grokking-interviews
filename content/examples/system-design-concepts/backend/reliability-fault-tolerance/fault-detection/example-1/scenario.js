/**
 * File: scenario.js
 * What it does: Declares the topic focus and tunable knobs for this example.
 */
module.exports = {
  topic: 'fault-detection',
  title: 'Fault Detection',
  focus: 'Heartbeat misses and detection delay.',
  behavior: 'Heartbeat misses and detection delay.',
  knobs: {
    simulateLatencyMs: 120,
    sampleSize: 20,
  },
};
