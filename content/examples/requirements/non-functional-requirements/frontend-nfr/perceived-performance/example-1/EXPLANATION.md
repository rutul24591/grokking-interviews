# Perceived performance: tactics that scale

Even with the same backend latency, the UI can feel dramatically faster if it:

- stays responsive (avoid blocking main thread),
- shows progress (skeletons/progress indicators),
- and avoids stale updates (abort + sequence guards).

This example includes:
- **AbortController** for canceling in-flight searches,
- **skeleton thresholding** (only show after 150ms),
- **optimistic update** for likes with rollback on failure.

