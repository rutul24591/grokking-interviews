/**
 * File: scenario.js
 * What it does: Declares the scenario focus and tuning knobs for the caching/performance app.
 */
module.exports = {
  topic: 'application-level-caching',
  focus: 'Local in-process cache with TTL + invalidation hooks to demonstrate app-level caching tradeoffs.',
  knobs: {
    ttlMs: 5000,
    maxEntries: 100,
    simulateLatencyMs: 120,
  },
};
