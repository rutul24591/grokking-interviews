/**
 * File: scenario.js
 * What it does: Declares the topic focus and tunable knobs for this example.
 */
module.exports = {
  topic: 'batch-processing',
  title: 'Batch Processing',
  focus: 'Batch window, throughput, and lateness.',
  behavior: 'Batch window, throughput, and lateness.',
  knobs: {
    simulateLatencyMs: 120,
    sampleSize: 20,
  },
};
