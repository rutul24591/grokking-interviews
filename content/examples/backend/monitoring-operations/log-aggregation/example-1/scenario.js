/**
 * File: scenario.js
 * What it does: Declares the topic focus and tunable knobs for this example.
 */
module.exports = {
  topic: 'log-aggregation',
  title: 'Log Aggregation',
  focus: 'Log ingestion rate and parse errors.',
  behavior: 'Log ingestion rate and parse errors.',
  knobs: {
    simulateLatencyMs: 120,
    sampleSize: 20,
  },
};
