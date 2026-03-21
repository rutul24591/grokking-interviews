# Example 1 — Online migration (phases: legacy → dual-write → read-new → cutover)

## Run
```bash
pnpm install
pnpm dev
```

Agent (drives phases + backfill and asserts correctness):
```bash
pnpm agent:run -- --baseUrl http://localhost:3000
```

## Files to start with
- `lib/migrationDb.ts`
- `app/api/migration/state/route.ts`
- `app/api/migration/backfill/route.ts`
- `app/api/users/route.ts`

