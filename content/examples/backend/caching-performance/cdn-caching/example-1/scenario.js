/**
 * File: scenario.js
 * What it does: Declares the scenario focus and tuning knobs for the caching/performance app.
 */
module.exports = {
  topic: 'cdn-caching',
  focus: 'Edge cache with TTL and purge API to simulate CDN behavior.',
  knobs: {
    ttlMs: 5000,
    maxEntries: 100,
    simulateLatencyMs: 120,
  },
};
