/**
 * File: scenario.js
 * What it does: Declares the scenario focus and tuning knobs for the caching/performance app.
 */
module.exports = {
  topic: 'http-caching',
  focus: 'ETag/If-None-Match and Cache-Control to illustrate conditional requests.',
  knobs: {
    ttlMs: 5000,
    maxEntries: 100,
    simulateLatencyMs: 120,
  },
};
