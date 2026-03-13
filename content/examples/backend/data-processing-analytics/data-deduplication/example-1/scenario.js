/**
 * File: scenario.js
 * What it does: Declares the topic focus and tunable knobs for this example.
 */
module.exports = {
  topic: 'data-deduplication',
  title: 'Data Deduplication',
  focus: 'Dedup rate and storage saved.',
  behavior: 'Dedup rate and storage saved.',
  knobs: {
    simulateLatencyMs: 120,
    sampleSize: 20,
  },
};
