# Example 1 — Versioned profile API (v1/v2) with compatibility shims

## Run
```bash
pnpm install
pnpm dev
```
Open `http://localhost:3000`.

Agent:
```bash
pnpm agent:run -- --baseUrl http://localhost:3000
```

## Files to start with
- `lib/contracts.ts` (v1/v2 schemas + adapters)
- `app/api/v1/profile/route.ts` and `app/api/v2/profile/route.ts`

