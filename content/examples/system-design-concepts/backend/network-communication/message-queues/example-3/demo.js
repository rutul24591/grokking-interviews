/**
 * File: demo.js
 * What it does: Highlights interview tradeoffs and decision points.
 */
const summary = {
  topic: 'Message Queues',
  focus: 'Queue depth, retries, and consumer throughput.',
  tradeoffs: [
    'Latency vs correctness',
    'Cost vs operational complexity',
    'Simplicity vs scalability',
  ],
};

console.log(summary);
