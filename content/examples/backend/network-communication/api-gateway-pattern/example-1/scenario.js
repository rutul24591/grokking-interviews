/**
 * File: scenario.js
 * What it does: Declares the topic focus and tunable knobs for this example.
 */
module.exports = {
  topic: 'api-gateway-pattern',
  title: 'Api Gateway Pattern',
  focus: 'Gateway routing, auth, and request shaping across services.',
  behavior: 'Gateway routing, auth, and request shaping across services.',
  knobs: {
    simulateLatencyMs: 120,
    sampleSize: 20,
  },
};
