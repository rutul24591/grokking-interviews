/**
 * File: scenario.js
 * What it does: Declares the topic focus and tunable knobs for this example.
 */
module.exports = {
  topic: 'service-decomposition',
  title: 'Service Decomposition',
  focus: 'Split monolith into services and call count.',
  behavior: 'Split monolith into services and call count.',
  knobs: {
    simulateLatencyMs: 120,
    sampleSize: 20,
  },
};
