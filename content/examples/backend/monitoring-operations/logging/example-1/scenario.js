/**
 * File: scenario.js
 * What it does: Declares the topic focus and tunable knobs for this example.
 */
module.exports = {
  topic: 'logging',
  title: 'Logging',
  focus: 'Structured log events and sampling.',
  behavior: 'Structured log events and sampling.',
  knobs: {
    simulateLatencyMs: 120,
    sampleSize: 20,
  },
};
