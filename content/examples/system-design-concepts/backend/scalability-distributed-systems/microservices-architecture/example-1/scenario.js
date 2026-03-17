/**
 * File: scenario.js
 * What it does: Declares the topic focus and tunable knobs for this example.
 */
module.exports = {
  topic: 'microservices-architecture',
  title: 'Microservices Architecture',
  focus: 'Service call graph depth and tail latency.',
  behavior: 'Service call graph depth and tail latency.',
  knobs: {
    simulateLatencyMs: 120,
    sampleSize: 20,
  },
};
