/**
 * File: scenario.js
 * What it does: Declares the topic focus and tunable knobs for this example.
 */
module.exports = {
  topic: 'multi-region-deployment',
  title: 'Multi Region Deployment',
  focus: 'Latency and region failover selection.',
  behavior: 'Latency and region failover selection.',
  knobs: {
    simulateLatencyMs: 120,
    sampleSize: 20,
  },
};
