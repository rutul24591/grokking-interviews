# Example 3 — Async validation + live status (advanced)

Demonstrates:

- debounced async validation (username availability) without spamming announcements
- `role="status"` + `aria-live="polite"` for non-interruptive updates
- production trade-off: do not block form submission on slow async validators; degrade gracefully

