# Example 2 — Discrete vs Continuous Events During Hydration

## Run it (after copy-paste)
```bash
pnpm install
pnpm dev
```

## Try
1. Hard refresh
2. Move the mouse over the box immediately (before hydration) — hover/mousemove events typically won’t be replayed.
3. Click the button immediately — click events are discrete and can be replayed once hydration completes.

