/**
 * File: scenario.js
 * What it does: Declares the topic focus and tunable knobs for this example.
 */
module.exports = {
  topic: 'kappa-architecture',
  title: 'Kappa Architecture',
  focus: 'Streaming-only processing lag.',
  behavior: 'Streaming-only processing lag.',
  knobs: {
    simulateLatencyMs: 120,
    sampleSize: 20,
  },
};
