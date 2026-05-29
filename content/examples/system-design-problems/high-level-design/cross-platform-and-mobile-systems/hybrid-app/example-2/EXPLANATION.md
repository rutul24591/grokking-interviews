# Hybrid APP - Example 2 Explanation

This example is tied to the article topic, not a generic placeholder. It models cross-platform client entities (platform, deviceTier, nativeBridge, offlineQueue, sharedContract, syncCursor), telemetry (bridgeErrorRate, offlineAgeMs, bundleKb, syncConflictCount, deviceCrashRate), and operational actions (disable-native-bridge, replay-offline-queue, use-web-fallback, gate-by-capability).

The code is meant to support interview discussion about invariants, failure boundaries, rollout safety, recovery, and the evidence needed to operate the design in production.
