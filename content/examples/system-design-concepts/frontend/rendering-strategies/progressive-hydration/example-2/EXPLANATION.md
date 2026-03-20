Example 2 extracts the core mechanics into reusable primitives:
- `useHydrateOnIdle()` — defers work until idle (with timeout)
- `useHydrateOnVisible()` — defers work until near-viewport

These primitives are useful when you want progressive hydration consistently across a codebase:
- keep cleanup correct (cancel idle callbacks / disconnect observers)
- avoid repeated imports when multiple islands use the same strategy

