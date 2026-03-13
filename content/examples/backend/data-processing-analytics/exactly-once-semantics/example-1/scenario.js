/**
 * File: scenario.js
 * What it does: Declares the topic focus and tunable knobs for this example.
 */
module.exports = {
  topic: 'exactly-once-semantics',
  title: 'Exactly Once Semantics',
  focus: 'Exactly-once processing and duplicates.',
  behavior: 'Exactly-once processing and duplicates.',
  knobs: {
    simulateLatencyMs: 120,
    sampleSize: 20,
  },
};
