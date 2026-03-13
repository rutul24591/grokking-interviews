/**
 * File: scenario.js
 * What it does: Declares the topic focus and tunable knobs for this example.
 */
module.exports = {
  topic: 'replication-strategies',
  title: 'Replication Strategies',
  focus: 'Leader/follower vs multi-leader conflict rate.',
  behavior: 'Leader/follower vs multi-leader conflict rate.',
  knobs: {
    simulateLatencyMs: 120,
    sampleSize: 20,
  },
};
