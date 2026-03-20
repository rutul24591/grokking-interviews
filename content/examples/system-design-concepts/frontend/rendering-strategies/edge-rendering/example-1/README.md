# Example 1 — Edge Rendering (Next.js Edge Runtime + Node Origin)

## What it shows
- Page renders with `export const runtime = "edge"`.
- Middleware creates a stable user id and experiment bucket.
- Edge-rendered page calls an Express origin API and can be cached with `revalidate`.

## Run it (after copy-paste)
```bash
pnpm install
pnpm dev
```

Open:
- `http://localhost:3000`

Try:
- Refresh a few times and see `uid` stay stable (cookie).
- Use a different browser/profile to see a different `uid` and potentially a different experiment bucket.

