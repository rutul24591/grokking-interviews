/**
 * File: demo.js
 * What it does: Highlights interview tradeoffs and decision points.
 */
const summary = {
  topic: 'Cqrs',
  focus: 'Write log + read projection freshness gap.',
  tradeoffs: [
    'Latency vs consistency',
    'Cost vs operational complexity',
    'Simplicity vs scalability',
  ],
};

console.log(summary);
