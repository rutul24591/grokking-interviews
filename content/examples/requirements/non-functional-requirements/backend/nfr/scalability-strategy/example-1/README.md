# Example 1 — Scalability strategy (rendezvous hashing + low-movement resharding)

## Run
```bash
pnpm install
pnpm dev
```

Agent (assigns 100 keys, adds a shard, asserts only a minority of keys move):
```bash
pnpm agent:run -- --baseUrl http://localhost:3000
```

## Files to start with
- `lib/rendezvous.ts`
- `lib/cluster.ts`
- `app/api/cluster/resize/route.ts`
- `app/api/cluster/assign/route.ts`

