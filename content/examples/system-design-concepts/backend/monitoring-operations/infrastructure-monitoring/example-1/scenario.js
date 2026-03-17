/**
 * File: scenario.js
 * What it does: Declares the topic focus and tunable knobs for this example.
 */
module.exports = {
  topic: 'infrastructure-monitoring',
  title: 'Infrastructure Monitoring',
  focus: 'CPU/memory utilization and saturation.',
  behavior: 'CPU/memory utilization and saturation.',
  knobs: {
    simulateLatencyMs: 120,
    sampleSize: 20,
  },
};
