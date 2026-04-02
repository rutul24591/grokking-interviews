# Example 1 — Retention policy engine (archive + delete + legal holds)

## Run
```bash
pnpm install
pnpm dev
```

Agent (ingests events at different ages, runs retention, asserts archive/delete/hold behavior):
```bash
pnpm agent:run -- --baseUrl http://localhost:3000
```

## Files to start with
- `lib/retentionStore.ts`
- `app/api/retention/run/route.ts`
- `app/api/events/ingest/route.ts`

