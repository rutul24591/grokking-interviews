Example 2 focuses on an important selective-hydration detail:

- **Discrete events** (click, submit, keydown) are prioritized and can be replayed after hydration.
- **Continuous events** (mousemove, scroll) generally are not replayed the same way.

This matters when designing UX:
- put critical actions behind discrete events
- avoid relying on hover/mousemove during hydration delays

