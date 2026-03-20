# Why contract tests reduce lock-in

Lock-in isn’t only about “which cloud you use” — it’s often about **behavioral coupling**:

- Your app silently depends on overwrite semantics.
- Your app assumes list ordering, or idempotent deletes, or exact error codes.
- A new adapter “mostly works” until data diverges in production.

Contract tests make those assumptions explicit and executable.

In this example:
- `runObjectStoreContract` defines *minimum viable semantics* for an `ObjectStore`.
- `BrokenNoOverwriteStore` violates overwrite behavior — a realistic migration pitfall.

Production note: run contracts against:
- a local adapter (fast),
- a staging cloud adapter (real integration),
- and a compatibility layer if you’re targeting a portable protocol (e.g., S3-compatible).

