# Example 1 — Multi-region replication (async lag + session consistency token)

## Run
```bash
pnpm install
pnpm dev
```

Agent (writes to region A, reads from region B before/after replication tick):
```bash
pnpm agent:run -- --baseUrl http://localhost:3000
```

## Files to start with
- `lib/multiRegionKv.ts`
- `app/api/kv/put/route.ts`
- `app/api/kv/get/route.ts`
- `app/api/replication/tick/route.ts`

