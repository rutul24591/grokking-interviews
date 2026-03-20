# Example 1 — Message ordering (per-stream sequencing + reordering buffer + de-dupe)

## Run
```bash
pnpm install
pnpm dev
```

Agent (publishes out of order and asserts processing becomes ordered once gaps fill):
```bash
pnpm agent:run -- --baseUrl http://localhost:3000
```

## Files to start with
- `lib/orderedStream.ts`
- `app/api/stream/publish/route.ts`

