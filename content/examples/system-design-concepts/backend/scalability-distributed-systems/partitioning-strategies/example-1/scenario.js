/**
 * File: scenario.js
 * What it does: Declares the topic focus and tunable knobs for this example.
 */
module.exports = {
  topic: 'partitioning-strategies',
  title: 'Partitioning Strategies',
  focus: 'Range vs hash distribution balance.',
  behavior: 'Range vs hash distribution balance.',
  knobs: {
    simulateLatencyMs: 120,
    sampleSize: 20,
  },
};
