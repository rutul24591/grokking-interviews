/**
 * File: scenario.js
 * What it does: Declares the topic focus and tunable knobs for this example.
 */
module.exports = {
  topic: 'split-brain-problem',
  title: 'Split Brain Problem',
  focus: 'Partitioned cluster with dual leaders.',
  behavior: 'Partitioned cluster with dual leaders.',
  knobs: {
    simulateLatencyMs: 120,
    sampleSize: 20,
  },
};
