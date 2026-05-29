# Email Client - Example 3 Explanation

This example is tied to the article topic, not a generic placeholder. It models messaging entities (conversation, message, participant, thread, deliveryReceipt, notification), telemetry (deliveryLagMs, fanoutSize, retryCount, unreadDrift, threadDepth), and operational actions (dedupe-message, repair-thread-order, retry-channel, suppress-duplicate-notification).

The code is meant to support interview discussion about invariants, failure boundaries, rollout safety, recovery, and the evidence needed to operate the design in production.
