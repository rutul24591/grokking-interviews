/**
 * File: scenario.js
 * What it does: Declares the topic focus and tunable knobs for this example.
 */
module.exports = {
  topic: 'windowing',
  title: 'Windowing',
  focus: 'Tumbling/sliding window evaluation cost.',
  behavior: 'Tumbling/sliding window evaluation cost.',
  knobs: {
    simulateLatencyMs: 120,
    sampleSize: 20,
  },
};
