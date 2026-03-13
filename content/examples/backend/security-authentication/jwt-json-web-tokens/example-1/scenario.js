/**
 * File: scenario.js
 * What it does: Declares the topic focus and tunable knobs for this example.
 */
module.exports = {
  topic: 'jwt-json-web-tokens',
  title: 'Jwt Json Web Tokens',
  focus: 'Token sign/verify and expiration.',
  behavior: 'Token sign/verify and expiration.',
  knobs: {
    simulateLatencyMs: 120,
    sampleSize: 20,
  },
};
