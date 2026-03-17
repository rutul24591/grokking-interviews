/**
 * File: scenario.js
 * What it does: Declares the topic focus and tunable knobs for this example.
 */
module.exports = {
  topic: 'event-streaming',
  title: 'Event Streaming',
  focus: 'Append-only stream with consumer lag.',
  behavior: 'Append-only stream with consumer lag.',
  knobs: {
    simulateLatencyMs: 120,
    sampleSize: 20,
  },
};
