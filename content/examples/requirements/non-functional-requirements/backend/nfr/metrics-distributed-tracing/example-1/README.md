# Example 1 — Metrics + distributed tracing (W3C traceparent + spans + query)

## Run
```bash
pnpm install
pnpm dev
```

Agent (makes a traced request and asserts spans were recorded):
```bash
pnpm agent:run -- --baseUrl http://localhost:3000
```

## Files to start with
- `lib/tracing.ts`
- `app/api/demo/route.ts`
- `app/api/traces/route.ts`

