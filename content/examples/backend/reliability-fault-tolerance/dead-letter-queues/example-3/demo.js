/**
 * File: demo.js
 * What it does: Highlights interview tradeoffs and decision points.
 */
const summary = {
  topic: 'Dead Letter Queues',
  focus: 'Failed message routing and retry counts.',
  tradeoffs: [
    'Latency vs consistency',
    'Cost vs operational complexity',
    'Simplicity vs scalability',
  ],
};

console.log(summary);
