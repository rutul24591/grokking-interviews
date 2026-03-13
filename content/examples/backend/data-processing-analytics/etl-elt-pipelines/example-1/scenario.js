/**
 * File: scenario.js
 * What it does: Declares the topic focus and tunable knobs for this example.
 */
module.exports = {
  topic: 'etl-elt-pipelines',
  title: 'Etl Elt Pipelines',
  focus: 'ETL vs ELT latency and cost.',
  behavior: 'ETL vs ELT latency and cost.',
  knobs: {
    simulateLatencyMs: 120,
    sampleSize: 20,
  },
};
