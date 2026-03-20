Example 3 covers an advanced, very practical aspect of selective hydration:

> **Suspense boundary placement** controls which parts can hydrate early.

If you wrap a large subtree in a single suspended boundary, you may unintentionally delay hydration of unrelated interactive controls.

This demo compares:
- `mode=coarse` — one big suspended boundary delays everything
- `mode=fine` — smaller boundary delays only the slow island

