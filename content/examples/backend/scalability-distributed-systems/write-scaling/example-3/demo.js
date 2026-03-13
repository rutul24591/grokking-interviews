/**
 * File: demo.js
 * What it does: Highlights interview tradeoffs and decision points.
 */
const summary = {
  topic: 'Write Scaling',
  focus: 'Batching + async writes impact throughput.',
  tradeoffs: [
    'Latency vs consistency',
    'Cost vs operational complexity',
    'Simplicity vs scalability',
  ],
};

console.log(summary);
