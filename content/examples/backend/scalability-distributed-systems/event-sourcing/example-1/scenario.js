/**
 * File: scenario.js
 * What it does: Declares the topic focus and tunable knobs for this example.
 */
module.exports = {
  topic: 'event-sourcing',
  title: 'Event Sourcing',
  focus: 'Append events and rebuild aggregate state.',
  behavior: 'Append events and rebuild aggregate state.',
  knobs: {
    simulateLatencyMs: 120,
    sampleSize: 20,
  },
};
