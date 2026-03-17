/**
 * File: demo.js
 * What it does: Highlights interview tradeoffs and decision points.
 */
const summary = {
  topic: 'Event Streaming',
  focus: 'Append-only stream with consumer lag.',
  tradeoffs: [
    'Latency vs correctness',
    'Cost vs operational complexity',
    'Simplicity vs scalability',
  ],
};

console.log(summary);
