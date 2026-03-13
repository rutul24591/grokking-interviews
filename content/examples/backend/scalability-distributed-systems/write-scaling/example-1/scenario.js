/**
 * File: scenario.js
 * What it does: Declares the topic focus and tunable knobs for this example.
 */
module.exports = {
  topic: 'write-scaling',
  title: 'Write Scaling',
  focus: 'Batching + async writes impact throughput.',
  behavior: 'Batching + async writes impact throughput.',
  knobs: {
    simulateLatencyMs: 120,
    sampleSize: 20,
  },
};
