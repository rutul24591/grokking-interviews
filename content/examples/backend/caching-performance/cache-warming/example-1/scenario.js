/**
 * File: scenario.js
 * What it does: Declares the scenario focus and tuning knobs for the caching/performance app.
 */
module.exports = {
  topic: 'cache-warming',
  focus: 'Warmup phase that preloads hot keys before traffic.',
  knobs: {
    ttlMs: 5000,
    maxEntries: 100,
    simulateLatencyMs: 120,
  },
};
