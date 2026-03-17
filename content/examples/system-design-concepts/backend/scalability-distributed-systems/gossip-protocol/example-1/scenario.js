/**
 * File: scenario.js
 * What it does: Declares the topic focus and tunable knobs for this example.
 */
module.exports = {
  topic: 'gossip-protocol',
  title: 'Gossip Protocol',
  focus: 'Membership gossip convergence rounds.',
  behavior: 'Membership gossip convergence rounds.',
  knobs: {
    simulateLatencyMs: 120,
    sampleSize: 20,
  },
};
