/**
 * File: scenario.js
 * What it does: Declares the topic focus and tunable knobs for this example.
 */
module.exports = {
  topic: 'disaster-recovery',
  title: 'Disaster Recovery',
  focus: 'RTO/RPO simulation with failover steps.',
  behavior: 'RTO/RPO simulation with failover steps.',
  knobs: {
    simulateLatencyMs: 120,
    sampleSize: 20,
  },
};
