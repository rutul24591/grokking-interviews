/**
 * File: scenario.js
 * What it does: Declares the topic focus and tunable knobs for this example.
 */
module.exports = {
  topic: 'data-compression',
  title: 'Data Compression',
  focus: 'Compression ratio vs CPU cost.',
  behavior: 'Compression ratio vs CPU cost.',
  knobs: {
    simulateLatencyMs: 120,
    sampleSize: 20,
  },
};
