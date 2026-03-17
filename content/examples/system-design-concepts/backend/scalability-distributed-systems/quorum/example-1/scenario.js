/**
 * File: scenario.js
 * What it does: Declares the topic focus and tunable knobs for this example.
 */
module.exports = {
  topic: 'quorum',
  title: 'Quorum',
  focus: 'R/W quorum tradeoffs for staleness/availability.',
  behavior: 'R/W quorum tradeoffs for staleness/availability.',
  knobs: {
    simulateLatencyMs: 120,
    sampleSize: 20,
  },
};
