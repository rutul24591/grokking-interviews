/**
 * File: scenario.js
 * What it does: Declares the topic focus and tunable knobs for this example.
 */
module.exports = {
  topic: 'data-denormalization',
  title: 'Data Denormalization',
  focus: 'Read speedup vs write amplification tradeoff.',
  behavior: 'Read speedup vs write amplification tradeoff.',
  knobs: {
    simulateLatencyMs: 120,
    sampleSize: 20,
  },
};
