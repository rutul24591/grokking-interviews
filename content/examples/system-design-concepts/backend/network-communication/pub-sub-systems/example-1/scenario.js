/**
 * File: scenario.js
 * What it does: Declares the topic focus and tunable knobs for this example.
 */
module.exports = {
  topic: 'pub-sub-systems',
  title: 'Pub Sub Systems',
  focus: 'Fan-out delivery and subscriber lag.',
  behavior: 'Fan-out delivery and subscriber lag.',
  knobs: {
    simulateLatencyMs: 120,
    sampleSize: 20,
  },
};
