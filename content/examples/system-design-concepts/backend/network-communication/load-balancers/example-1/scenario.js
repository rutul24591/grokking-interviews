/**
 * File: scenario.js
 * What it does: Declares the topic focus and tunable knobs for this example.
 */
module.exports = {
  topic: 'load-balancers',
  title: 'Load Balancers',
  focus: 'Traffic distribution and health-based routing.',
  behavior: 'Traffic distribution and health-based routing.',
  knobs: {
    simulateLatencyMs: 120,
    sampleSize: 20,
  },
};
