/**
 * File: scenario.js
 * What it does: Declares the topic focus and tunable knobs for this example.
 */
module.exports = {
  topic: 'idempotency',
  title: 'Idempotency',
  focus: 'Idempotency key dedupe results.',
  behavior: 'Idempotency key dedupe results.',
  knobs: {
    simulateLatencyMs: 120,
    sampleSize: 20,
  },
};
