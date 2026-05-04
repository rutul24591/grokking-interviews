# Infinite Scroll — Edge Cases

Edge cases:
- Scroll position jumps when images load (use fixed heights or ResizeObserver)
- Duplicate items when cursors overlap (dedupe by id)
- Retry + backoff when network flakes

