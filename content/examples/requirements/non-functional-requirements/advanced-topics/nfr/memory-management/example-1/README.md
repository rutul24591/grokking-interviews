# Example 1 — Memory Lab (Next.js + API workload + Node agent)

## What it shows
- A reproducible **memory leak** (unbounded retention).
- A bounded **LRU cache** alternative.
- Observability via `process.memoryUsage()`.

## Prereqs
- Node.js 20+ recommended (Node 18+ should work).
- `pnpm` installed.

## Run
```bash
pnpm install
pnpm dev
```
Open `http://localhost:3000`.

Agent:
```bash
pnpm agent:run -- --baseUrl http://localhost:3000 --mode leaky --requests 200
pnpm agent:run -- --baseUrl http://localhost:3000 --mode lru --requests 200
```

## Files to start with
- `lib/limiters.ts` (LRU cache)
- `app/api/work/route.ts` (allocation workload)
- `app/api/memory/route.ts` (memory stats)

