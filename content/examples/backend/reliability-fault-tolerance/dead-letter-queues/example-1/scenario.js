/**
 * File: scenario.js
 * What it does: Declares the topic focus and tunable knobs for this example.
 */
module.exports = {
  topic: 'dead-letter-queues',
  title: 'Dead Letter Queues',
  focus: 'Failed message routing and retry counts.',
  behavior: 'Failed message routing and retry counts.',
  knobs: {
    simulateLatencyMs: 120,
    sampleSize: 20,
  },
};
