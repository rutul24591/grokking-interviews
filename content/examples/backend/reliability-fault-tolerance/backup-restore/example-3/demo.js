/**
 * File: demo.js
 * What it does: Highlights interview tradeoffs and decision points.
 */
const summary = {
  topic: 'Backup Restore',
  focus: 'Snapshot + restore time and data loss window.',
  tradeoffs: [
    'Latency vs consistency',
    'Cost vs operational complexity',
    'Simplicity vs scalability',
  ],
};

console.log(summary);
