## Why module boundaries matter

In large frontends, you need boundaries that:
- reduce accidental coupling
- keep invariants in one place
- allow refactors without touching every caller

The “revealing module pattern” helps by:
- hiding internal state and helper functions
- exposing only a stable API

This example is intentionally small but mirrors how you’d encapsulate:
- a feature’s state machine
- caching logic
- instrumentation

