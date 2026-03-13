/**
 * File: scenario.js
 * What it does: Declares the topic focus and tunable knobs for this example.
 */
module.exports = {
  topic: 'authentication-vs-authorization',
  title: 'Authentication Vs Authorization',
  focus: 'Authn check then authz gate.',
  behavior: 'Authn check then authz gate.',
  knobs: {
    simulateLatencyMs: 120,
    sampleSize: 20,
  },
};
