/**
 * File: scenario.js
 * What it does: Declares the topic focus and tunable knobs for this example.
 */
module.exports = {
  topic: 'redundancy',
  title: 'Redundancy',
  focus: 'Replica factor and fault tolerance.',
  behavior: 'Replica factor and fault tolerance.',
  knobs: {
    simulateLatencyMs: 120,
    sampleSize: 20,
  },
};
