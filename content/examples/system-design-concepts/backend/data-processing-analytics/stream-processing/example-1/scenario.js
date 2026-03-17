/**
 * File: scenario.js
 * What it does: Declares the topic focus and tunable knobs for this example.
 */
module.exports = {
  topic: 'stream-processing',
  title: 'Stream Processing',
  focus: 'Windowed stream throughput and latency.',
  behavior: 'Windowed stream throughput and latency.',
  knobs: {
    simulateLatencyMs: 120,
    sampleSize: 20,
  },
};
