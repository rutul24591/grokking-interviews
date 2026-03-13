/**
 * File: demo.js
 * What it does: Highlights interview tradeoffs and decision points.
 */
const summary = {
  topic: 'Circuit Breaker Pattern',
  focus: 'Trip/half-open/close behavior under errors.',
  tradeoffs: [
    'Latency vs correctness',
    'Cost vs operational complexity',
    'Simplicity vs scalability',
  ],
};

console.log(summary);
