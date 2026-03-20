# Example 1 — Idempotent writes (Idempotency-Key + de-dupe + in-flight coalescing)

## Run
```bash
pnpm install
pnpm dev
```

Agent (retries the same charge and asserts the response is replayed):
```bash
pnpm agent:run -- --baseUrl http://localhost:3000
```

## Files to start with
- `lib/idempotencyStore.ts`
- `app/api/payments/charge/route.ts`

