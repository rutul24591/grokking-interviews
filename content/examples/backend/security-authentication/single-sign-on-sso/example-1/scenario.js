/**
 * File: scenario.js
 * What it does: Declares the topic focus and tunable knobs for this example.
 */
module.exports = {
  topic: 'single-sign-on-sso',
  title: 'Single Sign On Sso',
  focus: 'SSO assertion validation and user mapping.',
  behavior: 'SSO assertion validation and user mapping.',
  knobs: {
    simulateLatencyMs: 120,
    sampleSize: 20,
  },
};
