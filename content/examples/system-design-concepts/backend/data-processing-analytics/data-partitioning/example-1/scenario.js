/**
 * File: scenario.js
 * What it does: Declares the topic focus and tunable knobs for this example.
 */
module.exports = {
  topic: 'data-partitioning',
  title: 'Data Partitioning',
  focus: 'Partition skew and access locality.',
  behavior: 'Partition skew and access locality.',
  knobs: {
    simulateLatencyMs: 120,
    sampleSize: 20,
  },
};
