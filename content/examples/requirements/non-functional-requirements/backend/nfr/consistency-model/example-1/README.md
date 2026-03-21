# Example 1 — Consistency models (leader/follower + session “read-your-writes”)

## Run
```bash
pnpm install
pnpm dev
```

Agent (demonstrates stale follower reads, then catches up):
```bash
pnpm agent:run -- --baseUrl http://localhost:3000
```

## Files to start with
- `lib/replicatedKv.ts`
- `app/api/kv/put/route.ts`
- `app/api/kv/get/route.ts`

