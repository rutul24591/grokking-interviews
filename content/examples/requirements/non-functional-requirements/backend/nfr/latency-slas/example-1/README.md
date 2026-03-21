# Example 1 — Latency SLAs (budgeted execution + graceful degradation)

## Run
```bash
pnpm install
pnpm dev
```

Agent (runs fast + slow scenarios and asserts degradation happens before the SLA is blown):
```bash
pnpm agent:run -- --baseUrl http://localhost:3000
```

## Files to start with
- `lib/latencyBudget.ts`
- `app/api/feed/route.ts`

