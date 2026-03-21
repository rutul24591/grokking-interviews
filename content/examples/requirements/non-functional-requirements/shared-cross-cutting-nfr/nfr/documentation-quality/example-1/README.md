# Example 1 — Docs quality gate (lint + report + CI agent)

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
- `docs/*` (sample docs)
- `lib/lint.ts` (doc checks)
- `app/api/lint/route.ts` (report endpoint)

