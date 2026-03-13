/**
 * File: scenario.js
 * What it does: Declares the topic focus and tunable knobs for this example.
 */
module.exports = {
  topic: 'at-most-once-vs-at-least-once-vs-exactly-once',
  title: 'At Most Once Vs At Least Once Vs Exactly Once',
  focus: 'Delivery semantics and duplicate handling.',
  behavior: 'Delivery semantics and duplicate handling.',
  knobs: {
    simulateLatencyMs: 120,
    sampleSize: 20,
  },
};
