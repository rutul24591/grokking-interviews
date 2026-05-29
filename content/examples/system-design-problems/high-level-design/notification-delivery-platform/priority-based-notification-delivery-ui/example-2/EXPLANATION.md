# Priority Based Notification Delivery UI - Example 2 Explanation

This example is tied to the article topic, not a generic placeholder. It models notification delivery entities (notification, preference, channel, priority, provider, dedupeKey), telemetry (providerLatencyMs, quietHourSuppression, dedupeHit, priorityScore, deliveryAttempt), and operational actions (respect-quiet-hours, switch-provider, dedupe-send, escalate-priority).

The code is meant to support interview discussion about invariants, failure boundaries, rollout safety, recovery, and the evidence needed to operate the design in production.
