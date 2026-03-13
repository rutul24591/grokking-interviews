/**
 * File: scenario.js
 * What it does: Declares the topic focus and tunable knobs for this example.
 */
module.exports = {
  topic: 'aggregations',
  title: 'Aggregations',
  focus: 'Group-by aggregation cost and output size.',
  behavior: 'Group-by aggregation cost and output size.',
  knobs: {
    simulateLatencyMs: 120,
    sampleSize: 20,
  },
};
