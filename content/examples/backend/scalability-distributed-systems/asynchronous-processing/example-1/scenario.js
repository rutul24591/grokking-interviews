/**
 * File: scenario.js
 * What it does: Declares the topic focus and tunable knobs for this example.
 */
module.exports = {
  topic: 'asynchronous-processing',
  title: 'Asynchronous Processing',
  focus: 'Queue + worker backlog simulation with enqueue/dequeue latency.',
  behavior: 'Queue + worker backlog simulation with enqueue/dequeue latency.',
  knobs: {
    simulateLatencyMs: 120,
    sampleSize: 20,
  },
};
