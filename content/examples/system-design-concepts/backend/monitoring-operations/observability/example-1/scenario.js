/**
 * File: scenario.js
 * What it does: Declares the topic focus and tunable knobs for this example.
 */
module.exports = {
  topic: 'observability',
  title: 'Observability',
  focus: 'Signals coverage across logs/metrics/traces.',
  behavior: 'Signals coverage across logs/metrics/traces.',
  knobs: {
    simulateLatencyMs: 120,
    sampleSize: 20,
  },
};
