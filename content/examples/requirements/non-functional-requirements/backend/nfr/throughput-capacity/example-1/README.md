# Example 1 — Throughput capacity (micro-batching + throughput stats)

## Run
```bash
pnpm install
pnpm dev
```

Agent (ingests 50 items quickly and asserts they’re processed in fewer batches than items):
```bash
pnpm agent:run -- --baseUrl http://localhost:3000
```

## Files to start with
- `lib/batcher.ts`
- `app/api/ingest/route.ts`
- `app/api/stats/route.ts`

