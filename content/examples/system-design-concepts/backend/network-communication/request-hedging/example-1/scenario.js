/**
 * File: scenario.js
 * What it does: Declares the topic focus and tunable knobs for this example.
 */
module.exports = {
  topic: 'request-hedging',
  title: 'Request Hedging',
  focus: 'Hedged requests and tail latency reduction.',
  behavior: 'Hedged requests and tail latency reduction.',
  knobs: {
    simulateLatencyMs: 120,
    sampleSize: 20,
  },
};
