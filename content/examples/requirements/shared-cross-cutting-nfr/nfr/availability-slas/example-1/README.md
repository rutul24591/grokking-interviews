# Example 1 — SLA Lab (composite availability + downtime + Monte Carlo)

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
- `lib/availability.ts` (serial/parallel math + downtime)
- `app/api/calc/route.ts` and `app/api/simulate/route.ts`

