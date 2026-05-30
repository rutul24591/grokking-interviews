# Explanation

This example supports Design Local-First Architecture. It demonstrates local authoritative client runtime, the invariant "Local reads and writes remain available while the system eventually converges with trusted peers or server state.", and the production edge case where a user edits data on a low-connectivity device for hours and then reconnects after the schema has migrated. Use it to discuss API shape, state transitions, retry behavior, conflict handling, privacy scoping, and observability.
