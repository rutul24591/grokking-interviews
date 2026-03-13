/**
 * File: scenario.js
 * What it does: Declares the topic focus and tunable knobs for this example.
 */
module.exports = {
  topic: 'failover-mechanisms',
  title: 'Failover Mechanisms',
  focus: 'Active/passive promotion time.',
  behavior: 'Active/passive promotion time.',
  knobs: {
    simulateLatencyMs: 120,
    sampleSize: 20,
  },
};
