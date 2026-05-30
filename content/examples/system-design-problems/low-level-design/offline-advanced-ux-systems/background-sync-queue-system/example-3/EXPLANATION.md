# Explanation

This example supports Design a Background Sync Queue. It demonstrates durable mutation queue, the invariant "User intent must survive reloads and replay exactly once at the server boundary.", and the production edge case where a browser restarts after enqueueing a payment-related mutation but before receiving the server acknowledgement. Use it to discuss API shape, state transitions, retry behavior, conflict handling, privacy scoping, and observability.
