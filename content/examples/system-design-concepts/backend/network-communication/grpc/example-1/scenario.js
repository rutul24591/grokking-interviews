/**
 * File: scenario.js
 * What it does: Declares the topic focus and tunable knobs for this example.
 */
module.exports = {
  topic: 'grpc',
  title: 'Grpc',
  focus: 'Unary RPC latency and deadline handling.',
  behavior: 'Unary RPC latency and deadline handling.',
  knobs: {
    simulateLatencyMs: 120,
    sampleSize: 20,
  },
};
