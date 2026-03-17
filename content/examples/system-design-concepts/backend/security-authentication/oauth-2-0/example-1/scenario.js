/**
 * File: scenario.js
 * What it does: Declares the topic focus and tunable knobs for this example.
 */
module.exports = {
  topic: 'oauth-2-0',
  title: 'Oauth 2 0',
  focus: 'Auth code exchange and token issuance.',
  behavior: 'Auth code exchange and token issuance.',
  knobs: {
    simulateLatencyMs: 120,
    sampleSize: 20,
  },
};
