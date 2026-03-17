/**
 * File: demo.js
 * What it does: Highlights interview tradeoffs and decision points.
 */
const summary = {
  topic: 'Change Data Capture',
  focus: 'CDC stream lag and event ordering.',
  tradeoffs: [
    'Latency vs correctness',
    'Cost vs operational complexity',
    'Simplicity vs scalability',
  ],
};

console.log(summary);
