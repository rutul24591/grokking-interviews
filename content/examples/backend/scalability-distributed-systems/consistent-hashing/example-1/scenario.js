/**
 * File: scenario.js
 * What it does: Declares the topic focus and tunable knobs for this example.
 */
module.exports = {
  topic: 'consistent-hashing',
  title: 'Consistent Hashing',
  focus: 'Hash ring placement with node add/remove and key movement.',
  behavior: 'Hash ring placement with node add/remove and key movement.',
  knobs: {
    simulateLatencyMs: 120,
    sampleSize: 20,
  },
};
