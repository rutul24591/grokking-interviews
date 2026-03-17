/**
 * File: scenario.js
 * What it does: Declares the topic focus and tunable knobs for this example.
 */
module.exports = {
  topic: 'database-sharding',
  title: 'Database Sharding',
  focus: 'Shard key routing and hotspot detection.',
  behavior: 'Shard key routing and hotspot detection.',
  knobs: {
    simulateLatencyMs: 120,
    sampleSize: 20,
  },
};
