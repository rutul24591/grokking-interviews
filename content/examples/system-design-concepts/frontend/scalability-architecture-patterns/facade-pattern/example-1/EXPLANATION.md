## Why Facade is a production pattern

Frontends frequently depend on many backend capabilities:
- profile
- feed
- experiments
- billing
- notifications

If the UI calls all these services directly, it takes on:
- auth/token choreography
- retries/timeouts
- fan-out latency and waterfall risks
- inconsistent error handling

A **facade** (often a BFF) provides:
- a single, UI-friendly API
- aggregation + normalization
- shared resilience policies

This example shows a small facade with:
- concurrency
- timeouts
- partial results

