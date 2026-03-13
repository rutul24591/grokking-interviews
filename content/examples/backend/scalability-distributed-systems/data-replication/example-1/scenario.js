/**
 * File: scenario.js
 * What it does: Declares the topic focus and tunable knobs for this example.
 */
module.exports = {
  topic: 'data-replication',
  title: 'Data Replication',
  focus: 'Sync vs async replication lag simulation.',
  behavior: 'Sync vs async replication lag simulation.',
  knobs: {
    simulateLatencyMs: 120,
    sampleSize: 20,
  },
};
