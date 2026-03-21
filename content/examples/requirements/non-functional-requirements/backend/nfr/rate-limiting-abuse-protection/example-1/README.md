# Example 1 — Rate limiting (token bucket) + abuse “penalty box”

## Run
```bash
pnpm install
pnpm dev
```

Agent (bursts requests, expects 429s with Retry-After, then recovers):
```bash
pnpm agent:run -- --baseUrl http://localhost:3000
```

## Files to start with
- `lib/rateLimiter.ts`
- `app/api/protected/route.ts`

