# Example 1 — Feature rollout control plane (bucketing + metrics + kill switch)

## Run
```bash
pnpm install
pnpm dev
```
Open `http://localhost:3000`.

Agent:
```bash
pnpm agent:run -- --baseUrl http://localhost:3000 --steps 5
```

## Files to start with
- `lib/bucket.ts` (deterministic % rollout)
- `app/api/flags/*` (config)
- `app/api/metrics/*` (guardrails)

