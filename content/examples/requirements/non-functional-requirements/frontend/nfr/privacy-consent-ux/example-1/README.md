# Example 1 — Consent UI + server-side enforcement gate

## Run
```bash
pnpm install
pnpm dev
```

Agent (verifies gated analytics):
```bash
pnpm agent:run -- --baseUrl http://localhost:3000
```

## Files to start with
- `middleware.ts`
- `app/api/consent/route.ts`
- `app/api/analytics/route.ts`

