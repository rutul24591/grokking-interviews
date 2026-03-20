# Example 1 — Server-side caching (cache-aside + TTL + stampede protection)

## Run
```bash
pnpm install
pnpm dev
```

Agent (verifies miss→hit and coalesces concurrent misses to a single compute):
```bash
pnpm agent:run -- --baseUrl http://localhost:3000
```

## Files to start with
- `lib/cache.ts`
- `app/api/profile/route.ts`
- `app/api/cache/flush/route.ts`

