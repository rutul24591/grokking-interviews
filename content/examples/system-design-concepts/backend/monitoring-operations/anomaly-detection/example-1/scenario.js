/**
 * File: scenario.js
 * What it does: Declares the topic focus and tunable knobs for this example.
 */
module.exports = {
  topic: 'anomaly-detection',
  title: 'Anomaly Detection',
  focus: 'Anomaly scoring and detection latency.',
  behavior: 'Anomaly scoring and detection latency.',
  knobs: {
    simulateLatencyMs: 120,
    sampleSize: 20,
  },
};
