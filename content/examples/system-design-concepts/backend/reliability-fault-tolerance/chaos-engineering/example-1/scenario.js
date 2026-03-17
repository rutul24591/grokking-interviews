/**
 * File: scenario.js
 * What it does: Declares the topic focus and tunable knobs for this example.
 */
module.exports = {
  topic: 'chaos-engineering',
  title: 'Chaos Engineering',
  focus: 'Injected failure and blast radius report.',
  behavior: 'Injected failure and blast radius report.',
  knobs: {
    simulateLatencyMs: 120,
    sampleSize: 20,
  },
};
