/**
 * File: scenario.js
 * What it does: Declares the topic focus and tunable knobs for this example.
 */
module.exports = {
  topic: 'data-pipelines',
  title: 'Data Pipelines',
  focus: 'Pipeline stages and failure rate.',
  behavior: 'Pipeline stages and failure rate.',
  knobs: {
    simulateLatencyMs: 120,
    sampleSize: 20,
  },
};
