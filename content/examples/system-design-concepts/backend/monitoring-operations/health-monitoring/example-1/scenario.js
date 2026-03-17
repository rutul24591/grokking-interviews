/**
 * File: scenario.js
 * What it does: Declares the topic focus and tunable knobs for this example.
 */
module.exports = {
  topic: 'health-monitoring',
  title: 'Health Monitoring',
  focus: 'Health check status and MTTR signals.',
  behavior: 'Health check status and MTTR signals.',
  knobs: {
    simulateLatencyMs: 120,
    sampleSize: 20,
  },
};
