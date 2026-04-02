# Example 1 — Performance budget gate (samples → percentiles → pass/fail)

## Run
```bash
pnpm install
pnpm dev
```
Open `http://localhost:3000`.

Agent:
```bash
pnpm agent:run -- --baseUrl http://localhost:3000 --samples 200 --mode good
pnpm agent:run -- --baseUrl http://localhost:3000 --samples 200 --mode bad
```

## Files to start with
- `app/api/sample/route.ts` (ingest)
- `app/api/report/route.ts` (percentiles + gate)
- `app/api/config/route.ts` (budgets)

