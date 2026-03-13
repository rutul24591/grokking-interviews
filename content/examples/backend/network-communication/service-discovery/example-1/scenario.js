/**
 * File: scenario.js
 * What it does: Declares the topic focus and tunable knobs for this example.
 */
module.exports = {
  topic: 'service-discovery',
  title: 'Service Discovery',
  focus: 'Service registry lookups and stale endpoints.',
  behavior: 'Service registry lookups and stale endpoints.',
  knobs: {
    simulateLatencyMs: 120,
    sampleSize: 20,
  },
};
