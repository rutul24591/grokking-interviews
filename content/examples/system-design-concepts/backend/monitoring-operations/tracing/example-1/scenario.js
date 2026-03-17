/**
 * File: scenario.js
 * What it does: Declares the topic focus and tunable knobs for this example.
 */
module.exports = {
  topic: 'tracing',
  title: 'Tracing',
  focus: 'Trace sampling and latency attribution.',
  behavior: 'Trace sampling and latency attribution.',
  knobs: {
    simulateLatencyMs: 120,
    sampleSize: 20,
  },
};
