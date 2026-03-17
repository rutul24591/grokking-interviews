/**
 * File: scenario.js
 * What it does: Declares the topic focus and tunable knobs for this example.
 */
module.exports = {
  topic: 'distributed-locks',
  title: 'Distributed Locks',
  focus: 'Lock acquire/release with TTL and contention.',
  behavior: 'Lock acquire/release with TTL and contention.',
  knobs: {
    simulateLatencyMs: 120,
    sampleSize: 20,
  },
};
