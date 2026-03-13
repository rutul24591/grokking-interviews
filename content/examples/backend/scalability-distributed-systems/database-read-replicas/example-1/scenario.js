/**
 * File: scenario.js
 * What it does: Declares the topic focus and tunable knobs for this example.
 */
module.exports = {
  topic: 'database-read-replicas',
  title: 'Database Read Replicas',
  focus: 'Primary write + replica lag and read routing.',
  behavior: 'Primary write + replica lag and read routing.',
  knobs: {
    simulateLatencyMs: 120,
    sampleSize: 20,
  },
};
