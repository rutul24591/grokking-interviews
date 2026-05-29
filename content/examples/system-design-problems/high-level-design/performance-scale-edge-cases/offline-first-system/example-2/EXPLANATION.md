# Offline First System - Example 2 Explanation

This example is tied to the article topic, not a generic placeholder. It models performance entities (deviceTier, networkProfile, cacheEntry, fallbackMode, hydrationBudget, region), telemetry (p95LatencyMs, memoryMb, cacheHitRate, hydrationDelayMs, errorBudgetBurn), and operational actions (defer-work, serve-lite-mode, shed-load, increase-cache-ttl).

The code is meant to support interview discussion about invariants, failure boundaries, rollout safety, recovery, and the evidence needed to operate the design in production.
