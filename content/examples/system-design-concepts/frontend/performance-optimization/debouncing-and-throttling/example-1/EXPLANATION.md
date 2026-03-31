Example 1 is a full production-style search workbench.

It demonstrates:
- debouncing for expensive, server-bound search work
- throttling for low-priority telemetry
- cancellation of stale requests so out-of-order responses cannot corrupt UI state

This is the practical pattern used by search boxes, autosave flows, and analytics-heavy text inputs.
