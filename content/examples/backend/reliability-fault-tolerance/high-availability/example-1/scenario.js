/**
 * File: scenario.js
 * What it does: Declares the topic focus and tunable knobs for this example.
 */
module.exports = {
  topic: 'high-availability',
  title: 'High Availability',
  focus: 'N+1 redundancy and availability outcome.',
  behavior: 'N+1 redundancy and availability outcome.',
  knobs: {
    simulateLatencyMs: 120,
    sampleSize: 20,
  },
};
