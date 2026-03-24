# Example 3 — Exposure logging + dedupe (advanced)

Demonstrates:

- logging “flag exposure” when a user sees a flagged experience
- idempotent dedupe (`flagKey:userId`) to avoid inflating analytics
- a simple server endpoint showing the ingestion boundary

