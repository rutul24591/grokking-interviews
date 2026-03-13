/**
 * File: scenario.js
 * What it does: Declares the topic focus and tunable knobs for this example.
 */
module.exports = {
  topic: 'message-queues',
  title: 'Message Queues',
  focus: 'Queue depth, retries, and consumer throughput.',
  behavior: 'Queue depth, retries, and consumer throughput.',
  knobs: {
    simulateLatencyMs: 120,
    sampleSize: 20,
  },
};
