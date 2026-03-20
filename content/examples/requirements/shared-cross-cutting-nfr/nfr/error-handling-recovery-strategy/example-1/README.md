# Example 1 — Resilient publish API (idempotency + retries + circuit breaker)

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
pnpm agent:run -- --baseUrl http://localhost:3000 --repeats 10
```

## Files to start with
- `lib/retry.ts` (backoff + jitter)
- `lib/breaker.ts` (circuit breaker)
- `app/api/publish/route.ts` (idempotency + retries + breaker)

