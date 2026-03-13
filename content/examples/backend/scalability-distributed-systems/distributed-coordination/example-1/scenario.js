/**
 * File: scenario.js
 * What it does: Declares the topic focus and tunable knobs for this example.
 */
module.exports = {
  topic: 'distributed-coordination',
  title: 'Distributed Coordination',
  focus: 'Lease acquisition with expiry and renewal.',
  behavior: 'Lease acquisition with expiry and renewal.',
  knobs: {
    simulateLatencyMs: 120,
    sampleSize: 20,
  },
};
