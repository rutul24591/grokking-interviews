# Explanation

This example supports Design Idle Task Scheduling. It demonstrates the main-thread idle work scheduler, protects the invariant "Non-urgent work must not steal time from input, rendering, or critical network response handling.", and covers the edge case where continuous user interaction prevents idle callbacks from running while analytics and cache cleanup pile up. Use it to discuss browser support, permissions, cleanup, fallback UX, and observability.
