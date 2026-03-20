Example 1 demonstrates a practical form of **Progressive Hydration**:

> Delay loading/mounting heavy islands until the user is likely to need them.

This example renders three island slots:
- **Immediate**: loads the heavy island right away
- **Idle**: waits for `requestIdleCallback` (or a timeout fallback)
- **Visible**: waits until the island is near the viewport (IntersectionObserver)

This helps improve:
- initial main-thread availability
- input responsiveness during initial navigation
- perceived performance on low-end devices

