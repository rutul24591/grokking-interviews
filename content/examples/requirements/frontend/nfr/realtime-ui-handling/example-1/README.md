# Example 1 — Realtime stream via SSE (resume + backoff + dedupe)

## Run
```bash
pnpm install
pnpm dev
```

Agent (API smoke):
```bash
pnpm agent:run -- --baseUrl http://localhost:3000
```

## Files to start with
- `app/api/realtime/stream/route.ts`
- `components/StreamClient.tsx`
- `lib/realtime.ts`

