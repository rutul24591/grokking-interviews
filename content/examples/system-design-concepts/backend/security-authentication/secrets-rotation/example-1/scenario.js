/**
 * File: scenario.js
 * What it does: Declares the topic focus and tunable knobs for this example.
 */
module.exports = {
  topic: 'secrets-rotation',
  title: 'Secrets Rotation',
  focus: 'Current/previous key acceptance window.',
  behavior: 'Current/previous key acceptance window.',
  knobs: {
    simulateLatencyMs: 120,
    sampleSize: 20,
  },
};
