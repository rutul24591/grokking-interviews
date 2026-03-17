/**
 * File: scenario.js
 * What it does: Declares the topic focus and tunable knobs for this example.
 */
module.exports = {
  topic: 'server-sent-events',
  title: 'Server Sent Events',
  focus: 'SSE stream delivery and reconnect behavior.',
  behavior: 'SSE stream delivery and reconnect behavior.',
  knobs: {
    simulateLatencyMs: 120,
    sampleSize: 20,
  },
};
