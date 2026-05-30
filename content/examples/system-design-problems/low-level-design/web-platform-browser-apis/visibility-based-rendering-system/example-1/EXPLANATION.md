# Explanation

This example supports Design Visibility-Based Rendering. It demonstrates the document and viewport visibility coordinator, protects the invariant "Hidden or offscreen UI should stop expensive work without losing state or surprising the user on resume.", and covers the edge case where a real-time dashboard tab is hidden for twenty minutes and then resumes with stale data and queued timers. Use it to discuss browser support, permissions, cleanup, fallback UX, and observability.
