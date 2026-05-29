# Hybrid APP - Example 1 Explanation

## Article alignment

This example supports `high-level-design/cross-platform-mobile-systems/hybrid-app-webview-native-bridge`. It maps to the regenerated article sections:

- Definition & Context
- Core Concepts
- Architecture & Flow
- Trade offs & Comparison
- Best practices
- Common Pitfalls
- Real-world use cases
- Common interview question with detailed answer

## What this example demonstrates

The example implements a runnable readiness gate for a cross-platform client system. It uses the same production concerns covered by the article: shared contract compatibility, offline queue replay, device capability fallback, native bridge safety, hydration consistency.

## Why this is not generic

The code carries topic-specific telemetry and failure modes:

- Telemetry: bundleKb, offlineAgeMs, bridgeErrorRate, deviceTier, syncConflictCount
- Failure modes: native bridge timeout, stale offline mutation, platform capability gap, large bundle on low-end device, conflicting shared state

These are the exact kinds of concrete details expected in staff and principal system design interviews. The example is meant to help explain how the article's architecture behaves at runtime, under risk, and during recovery.

## Interview value

Use this example to move from architecture narration to implementation reasoning. A strong answer should explain the invariant being protected, the data needed to make the decision, the fallback or rollback path, and the metrics that prove the system is healthy after the change.
