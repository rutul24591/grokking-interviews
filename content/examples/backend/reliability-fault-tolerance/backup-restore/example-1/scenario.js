/**
 * File: scenario.js
 * What it does: Declares the topic focus and tunable knobs for this example.
 */
module.exports = {
  topic: 'backup-restore',
  title: 'Backup Restore',
  focus: 'Snapshot + restore time and data loss window.',
  behavior: 'Snapshot + restore time and data loss window.',
  knobs: {
    simulateLatencyMs: 120,
    sampleSize: 20,
  },
};
