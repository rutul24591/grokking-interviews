/**
 * File: scenario.js
 * What it does: Declares the scenario focus and tuning knobs for the caching/performance app.
 */
module.exports = {
  topic: 'cache-stampede',
  focus: 'Single-flight lock to prevent thundering herd on hot keys.',
  knobs: {
    ttlMs: 5000,
    maxEntries: 100,
    simulateLatencyMs: 120,
  },
};
