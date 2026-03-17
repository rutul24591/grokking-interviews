/**
 * File: scenario.js
 * What it does: Declares the topic focus and tunable knobs for this example.
 */
module.exports = {
  topic: 'session-management',
  title: 'Session Management',
  focus: 'Session creation/renew/expiry flow.',
  behavior: 'Session creation/renew/expiry flow.',
  knobs: {
    simulateLatencyMs: 120,
    sampleSize: 20,
  },
};
