/**
 * File: scenario.js
 * What it does: Declares the topic focus and tunable knobs for this example.
 */
module.exports = {
  topic: 'apache-kafka',
  title: 'Apache Kafka',
  focus: 'Kafka partitions, throughput, and lag.',
  behavior: 'Kafka partitions, throughput, and lag.',
  knobs: {
    simulateLatencyMs: 120,
    sampleSize: 20,
  },
};
