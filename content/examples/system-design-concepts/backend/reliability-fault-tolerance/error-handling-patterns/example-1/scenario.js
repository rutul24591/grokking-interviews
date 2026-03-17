/**
 * File: scenario.js
 * What it does: Declares the topic focus and tunable knobs for this example.
 */
module.exports = {
  topic: 'error-handling-patterns',
  title: 'Error Handling Patterns',
  focus: 'Retry + circuit breaker outcomes.',
  behavior: 'Retry + circuit breaker outcomes.',
  knobs: {
    simulateLatencyMs: 120,
    sampleSize: 20,
  },
};
