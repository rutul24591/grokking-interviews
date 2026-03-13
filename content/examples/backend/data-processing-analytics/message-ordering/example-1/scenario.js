/**
 * File: scenario.js
 * What it does: Declares the topic focus and tunable knobs for this example.
 */
module.exports = {
  topic: 'message-ordering',
  title: 'Message Ordering',
  focus: 'Ordering violations and buffer depth.',
  behavior: 'Ordering violations and buffer depth.',
  knobs: {
    simulateLatencyMs: 120,
    sampleSize: 20,
  },
};
