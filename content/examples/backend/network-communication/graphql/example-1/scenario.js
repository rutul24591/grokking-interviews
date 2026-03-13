/**
 * File: scenario.js
 * What it does: Declares the topic focus and tunable knobs for this example.
 */
module.exports = {
  topic: 'graphql',
  title: 'Graphql',
  focus: 'Graph query resolution and N+1 mitigation.',
  behavior: 'Graph query resolution and N+1 mitigation.',
  knobs: {
    simulateLatencyMs: 120,
    sampleSize: 20,
  },
};
