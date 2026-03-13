/**
 * File: scenario.js
 * What it does: Declares the topic focus and tunable knobs for this example.
 */
module.exports = {
  topic: 'apache-spark',
  title: 'Apache Spark',
  focus: 'Spark job stages and shuffle cost.',
  behavior: 'Spark job stages and shuffle cost.',
  knobs: {
    simulateLatencyMs: 120,
    sampleSize: 20,
  },
};
