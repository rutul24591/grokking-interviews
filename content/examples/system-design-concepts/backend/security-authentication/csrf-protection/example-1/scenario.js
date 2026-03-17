/**
 * File: scenario.js
 * What it does: Declares the topic focus and tunable knobs for this example.
 */
module.exports = {
  topic: 'csrf-protection',
  title: 'Csrf Protection',
  focus: 'CSRF token verification outcomes.',
  behavior: 'CSRF token verification outcomes.',
  knobs: {
    simulateLatencyMs: 120,
    sampleSize: 20,
  },
};
