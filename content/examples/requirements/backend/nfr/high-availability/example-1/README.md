# Example 1 — High availability (active/passive failover with leader election)

## Run
```bash
pnpm install
pnpm dev
```

Agent (writes, fails leader, triggers election, and verifies service continuity):
```bash
pnpm agent:run -- --baseUrl http://localhost:3000
```

## Files to start with
- `lib/haCluster.ts`
- `app/api/cluster/elect/route.ts`
- `app/api/write/route.ts`

