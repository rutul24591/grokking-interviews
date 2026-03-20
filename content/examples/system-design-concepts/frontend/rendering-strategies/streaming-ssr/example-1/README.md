# Example 1 — Streaming SSR with Suspense Boundaries (Next.js + Node.js)

## What it shows
- Streaming SSR with a fast “shell” and two slow panels.
- Independent `Suspense` boundaries so slow calls don’t block the entire HTML response.
- A separate Express “origin” API to simulate real downstream latency.

## Run it (after copy-paste)
```bash
pnpm install
pnpm dev
```

Open:
- `http://localhost:3000`

Tune delays:
- `http://localhost:3000/?sidebarDelayMs=1800&recoDelayMs=2800`

Observe streaming from a terminal:
```bash
curl -N http://localhost:3000
```

