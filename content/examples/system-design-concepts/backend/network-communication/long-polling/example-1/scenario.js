/**
 * File: scenario.js
 * What it does: Declares the topic focus and tunable knobs for this example.
 */
module.exports = {
  topic: 'long-polling',
  title: 'Long Polling',
  focus: 'Long poll latency and reconnect intervals.',
  behavior: 'Long poll latency and reconnect intervals.',
  knobs: {
    simulateLatencyMs: 120,
    sampleSize: 20,
  },
};
