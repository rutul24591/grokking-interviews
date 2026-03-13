/**
 * File: scenario.js
 * What it does: Declares the topic focus and tunable knobs for this example.
 */
module.exports = {
  topic: 'multi-factor-authentication',
  title: 'Multi Factor Authentication',
  focus: 'MFA challenge success/failure.',
  behavior: 'MFA challenge success/failure.',
  knobs: {
    simulateLatencyMs: 120,
    sampleSize: 20,
  },
};
