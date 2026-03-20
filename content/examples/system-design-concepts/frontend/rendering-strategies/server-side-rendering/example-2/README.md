# Example 2 — SSR Optimization: Sequential vs Parallel Fetch

## What it shows
- How SSR TTFB grows with sequential fetches (“waterfall”).
- How `Promise.all` reduces SSR latency by parallelizing independent calls.

## Run it (after copy-paste)
```bash
pnpm install
pnpm dev
```

Open:
- `http://localhost:3000/?mode=sequential`
- `http://localhost:3000/?mode=parallel`

