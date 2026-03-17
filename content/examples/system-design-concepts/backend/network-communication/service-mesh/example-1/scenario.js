/**
 * File: scenario.js
 * What it does: Declares the topic focus and tunable knobs for this example.
 */
module.exports = {
  topic: 'service-mesh',
  title: 'Service Mesh',
  focus: 'Sidecar routing and policy enforcement.',
  behavior: 'Sidecar routing and policy enforcement.',
  knobs: {
    simulateLatencyMs: 120,
    sampleSize: 20,
  },
};
