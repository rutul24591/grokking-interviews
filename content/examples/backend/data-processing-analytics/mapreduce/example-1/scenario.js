/**
 * File: scenario.js
 * What it does: Declares the topic focus and tunable knobs for this example.
 */
module.exports = {
  topic: 'mapreduce',
  title: 'Mapreduce',
  focus: 'Map/reduce stage time and shuffle.',
  behavior: 'Map/reduce stage time and shuffle.',
  knobs: {
    simulateLatencyMs: 120,
    sampleSize: 20,
  },
};
