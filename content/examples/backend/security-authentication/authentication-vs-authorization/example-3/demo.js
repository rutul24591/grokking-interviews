/**
 * File: demo.js
 * What it does: Highlights interview tradeoffs and decision points.
 */
const summary = {
  topic: 'Authentication Vs Authorization',
  focus: 'Authn check then authz gate.',
  tradeoffs: [
    'Latency vs consistency',
    'Cost vs operational complexity',
    'Simplicity vs scalability',
  ],
};

console.log(summary);
