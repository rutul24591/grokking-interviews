/**
 * File: scenario.js
 * What it does: Declares the topic focus and tunable knobs for this example.
 */
module.exports = {
  topic: 'websockets',
  title: 'Websockets',
  focus: 'Persistent connection health and message latency.',
  behavior: 'Persistent connection health and message latency.',
  knobs: {
    simulateLatencyMs: 120,
    sampleSize: 20,
  },
};
