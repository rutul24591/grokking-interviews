# Example 1 — Structured logs with requestId + redaction + query

## Run
```bash
pnpm install
pnpm dev
```

Agent (places order and asserts redaction):
```bash
pnpm agent:run -- --baseUrl http://localhost:3000
```

## Files to start with
- `middleware.ts`
- `lib/logger.ts`
- `app/api/order/route.ts`

