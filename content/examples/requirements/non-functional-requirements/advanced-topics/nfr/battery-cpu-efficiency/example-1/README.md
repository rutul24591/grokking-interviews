# Example 1 — Efficiency Lab (ETags + adaptive polling + long-task telemetry)

## What it shows
- **ETag** caching with `If-None-Match` (saves network + battery).
- Adaptive polling that backs off when the tab is hidden.
- **Long Task** measurement + server-side aggregation.

## Prereqs
- Node.js 20+ recommended (Node 18+ should work).
- `pnpm` installed.

## Run
```bash
pnpm install
pnpm dev
```
Open `http://localhost:3000`.

Optional agent:
```bash
pnpm agent:run -- --baseUrl http://localhost:3000 --requests 50
```

## Files to start with
- `app/api/feed/route.ts` (ETag + 304 responses)
- `app/api/telemetry/route.ts` + `app/api/report/route.ts` (RUM-like aggregation)
- `app/page.tsx` (naive vs optimized client behavior)

