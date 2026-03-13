/**
 * File: demo.js
 * What it does: Highlights interview tradeoffs and decision points.
 */
const summary = {
  topic: 'Throttling Rate Limiting',
  focus: 'Token bucket allow/deny decisions.',
  tradeoffs: [
    'Latency vs correctness',
    'Cost vs operational complexity',
    'Simplicity vs scalability',
  ],
};

console.log(summary);
