# Example 1 — RUM pipeline (capture → ingest → aggregate)

## What it shows
- A minimal **RUM SDK**: errors + a few Web Performance signals (FCP/LCP/CLS).
- A server-side **ingest endpoint** with payload validation and a ring buffer.
- A tiny **live summary** view for triage (counts + p95 LCP + top errors).

## Run
```bash
pnpm install
pnpm dev
```

Agent (synthetic ingest):
```bash
pnpm agent:run -- --baseUrl http://localhost:3000
```

## Files to start with
- `lib/rum/client.ts`
- `app/api/rum/ingest/route.ts`
- `lib/rum/store.ts`

