/**
 * File: scenario.js
 * What it does: Declares the topic focus and tunable knobs for this example.
 */
module.exports = {
  topic: 'data-integrity',
  title: 'Data Integrity',
  focus: 'Checksum verification and corruption detection.',
  behavior: 'Checksum verification and corruption detection.',
  knobs: {
    simulateLatencyMs: 120,
    sampleSize: 20,
  },
};
