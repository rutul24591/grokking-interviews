/**
 * File: scenario.js
 * What it does: Declares the topic focus and tunable knobs for this example.
 */
module.exports = {
  topic: 'server-sent-events-sse',
  title: 'Server Sent Events Sse',
  focus: 'SSE event stream health and drop rate.',
  behavior: 'SSE event stream health and drop rate.',
  knobs: {
    simulateLatencyMs: 120,
    sampleSize: 20,
  },
};
