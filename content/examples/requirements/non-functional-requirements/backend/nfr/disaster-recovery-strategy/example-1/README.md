# Example 1 — Disaster recovery (snapshots, outage simulation, restore, RPO loss)

## Run
```bash
pnpm install
pnpm dev
```

Agent (takes snapshot, writes extra data, simulates outage, restores, and verifies RPO data loss):
```bash
pnpm agent:run -- --baseUrl http://localhost:3000
```

## Files to start with
- `lib/drStore.ts`
- `app/api/dr/snapshot/route.ts`
- `app/api/dr/restore/route.ts`

