/**
 * File: scenario.js
 * What it does: Declares the topic focus and tunable knobs for this example.
 */
module.exports = {
  topic: 'circuit-breaker-pattern',
  title: 'Circuit Breaker Pattern',
  focus: 'Trip/half-open/close behavior under errors.',
  behavior: 'Trip/half-open/close behavior under errors.',
  knobs: {
    simulateLatencyMs: 120,
    sampleSize: 20,
  },
};
