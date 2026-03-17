/**
 * File: scenario.js
 * What it does: Declares the topic focus and tunable knobs for this example.
 */
module.exports = {
  topic: 'database-monitoring',
  title: 'Database Monitoring',
  focus: 'DB QPS, latency, and slow query rate.',
  behavior: 'DB QPS, latency, and slow query rate.',
  knobs: {
    simulateLatencyMs: 120,
    sampleSize: 20,
  },
};
