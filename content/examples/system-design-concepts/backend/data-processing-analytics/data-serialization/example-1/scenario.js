/**
 * File: scenario.js
 * What it does: Declares the topic focus and tunable knobs for this example.
 */
module.exports = {
  topic: 'data-serialization',
  title: 'Data Serialization',
  focus: 'Serialize/deserialize latency and size.',
  behavior: 'Serialize/deserialize latency and size.',
  knobs: {
    simulateLatencyMs: 120,
    sampleSize: 20,
  },
};
