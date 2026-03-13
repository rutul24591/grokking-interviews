/**
 * File: scenario.js
 * What it does: Declares the topic focus and tunable knobs for this example.
 */
module.exports = {
  topic: 'horizontal-scaling',
  title: 'Horizontal Scaling',
  focus: 'Instance count vs throughput/latency.',
  behavior: 'Instance count vs throughput/latency.',
  knobs: {
    simulateLatencyMs: 120,
    sampleSize: 20,
  },
};
