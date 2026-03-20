# Example 2 — React `renderToPipeableStream` (Streaming SSR primitive)

## What it shows
- Server streams HTML in chunks.
- `Suspense` fallback renders first, then the slow section streams later.

## Run it
```bash
pnpm install
pnpm start
```

Then in another terminal:
```bash
curl -N http://localhost:3050
```

