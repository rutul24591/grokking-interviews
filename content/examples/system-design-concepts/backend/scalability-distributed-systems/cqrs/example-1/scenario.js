/**
 * File: scenario.js
 * What it does: Declares the topic focus and tunable knobs for this example.
 */
module.exports = {
  topic: 'cqrs',
  title: 'Cqrs',
  focus: 'Write log + read projection freshness gap.',
  behavior: 'Write log + read projection freshness gap.',
  knobs: {
    simulateLatencyMs: 120,
    sampleSize: 20,
  },
};
