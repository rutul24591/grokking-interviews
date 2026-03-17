/**
 * File: scenario.js
 * What it does: Declares the topic focus and tunable knobs for this example.
 */
module.exports = {
  topic: 'distributed-transactions',
  title: 'Distributed Transactions',
  focus: '2PC vs saga outcome comparison.',
  behavior: '2PC vs saga outcome comparison.',
  knobs: {
    simulateLatencyMs: 120,
    sampleSize: 20,
  },
};
