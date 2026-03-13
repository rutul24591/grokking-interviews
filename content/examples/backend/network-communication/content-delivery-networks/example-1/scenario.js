/**
 * File: scenario.js
 * What it does: Declares the topic focus and tunable knobs for this example.
 */
module.exports = {
  topic: 'content-delivery-networks',
  title: 'Content Delivery Networks',
  focus: 'Edge cache hits and origin shielding.',
  behavior: 'Edge cache hits and origin shielding.',
  knobs: {
    simulateLatencyMs: 120,
    sampleSize: 20,
  },
};
