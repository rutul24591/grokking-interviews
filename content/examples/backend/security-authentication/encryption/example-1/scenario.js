/**
 * File: scenario.js
 * What it does: Declares the topic focus and tunable knobs for this example.
 */
module.exports = {
  topic: 'encryption',
  title: 'Encryption',
  focus: 'Encrypt/decrypt round-trip with key id.',
  behavior: 'Encrypt/decrypt round-trip with key id.',
  knobs: {
    simulateLatencyMs: 120,
    sampleSize: 20,
  },
};
