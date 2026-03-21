# Example 1 — Cost model + budget guardrails (cache hit rate, egress, reserved discount)

## Run
```bash
pnpm install
pnpm dev
```

Agent (compares two scenarios and asserts the optimized one is cheaper):
```bash
pnpm agent:run -- --baseUrl http://localhost:3000
```

## Files to start with
- `lib/costModel.ts`
- `app/api/cost/estimate/route.ts`

