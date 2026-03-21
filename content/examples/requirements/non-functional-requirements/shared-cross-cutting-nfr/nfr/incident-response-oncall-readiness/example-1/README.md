# Example 1 — Incident Console (alerts → dedup → incident timeline → escalation)

## Prereqs
- Node.js 20+ recommended (Node 18+ should work).
- `pnpm` installed.

## Run
```bash
pnpm install
pnpm dev
```
Open `http://localhost:3000`.

Agent:
```bash
pnpm agent:run -- --baseUrl http://localhost:3000 --alerts 60
```

## Files to start with
- `lib/store.ts` (dedup + incident state)
- `app/api/alerts/route.ts` (ingest)
- `app/api/incidents/*` (ack/resolve)

