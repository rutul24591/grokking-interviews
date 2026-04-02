# Example 1 — Resilience (timeouts + retries + circuit breaker + fallback)

## Run
```bash
pnpm install
pnpm dev
```

Agent (forces dependency failures, opens breaker, then recovers):
```bash
pnpm agent:run -- --baseUrl http://localhost:3000
```

## Files to start with
- `lib/circuitBreaker.ts`
- `lib/dependencySim.ts`
- `app/api/service/route.ts`

