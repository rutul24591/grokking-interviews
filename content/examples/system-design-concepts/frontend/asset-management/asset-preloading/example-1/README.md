# Asset Preloading — Example 1

## What this runs
- Next.js App Router UI
- Next.js Route Handlers acting as the “asset origin” (Node.js runtime)

## Run
```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000` and observe:
- `link[rel=preload]` in the HTML head
- `/api/assets/hero` returning strong caching headers (`ETag`, `Cache-Control: immutable`)

