/**
 * File: scenario.js
 * What it does: Declares the topic focus and tunable knobs for this example.
 */
module.exports = {
  topic: 'distributed-tracing',
  title: 'Distributed Tracing',
  focus: 'Span correlation and trace completeness.',
  behavior: 'Span correlation and trace completeness.',
  knobs: {
    simulateLatencyMs: 120,
    sampleSize: 20,
  },
};
