/**
 * File: scenario.js
 * What it does: Declares the topic focus and tunable knobs for this example.
 */
module.exports = {
  topic: 'consensus-algorithms',
  title: 'Consensus Algorithms',
  focus: 'Leader election with majority voting and term changes.',
  behavior: 'Leader election with majority voting and term changes.',
  knobs: {
    simulateLatencyMs: 120,
    sampleSize: 20,
  },
};
