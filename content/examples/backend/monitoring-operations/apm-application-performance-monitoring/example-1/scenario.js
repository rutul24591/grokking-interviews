/**
 * File: scenario.js
 * What it does: Declares the topic focus and tunable knobs for this example.
 */
module.exports = {
  topic: 'apm-application-performance-monitoring',
  title: 'Apm Application Performance Monitoring',
  focus: 'APM trace summaries and hotspots.',
  behavior: 'APM trace summaries and hotspots.',
  knobs: {
    simulateLatencyMs: 120,
    sampleSize: 20,
  },
};
