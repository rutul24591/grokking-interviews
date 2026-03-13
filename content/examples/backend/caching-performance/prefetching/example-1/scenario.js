/**
 * File: scenario.js
 * What it does: Declares the scenario focus and tuning knobs for the caching/performance app.
 */
module.exports = {
  topic: 'prefetching',
  focus: 'Predictive prefetch queue with priority levels.',
  knobs: {
    ttlMs: 5000,
    maxEntries: 100,
    simulateLatencyMs: 120,
  },
};
