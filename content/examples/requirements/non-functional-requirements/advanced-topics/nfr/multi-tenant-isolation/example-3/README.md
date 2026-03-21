# Example 3 — Tenant Context Leakage (AsyncLocalStorage)

## Run
```bash
pnpm install
pnpm demo
```

## What it shows
- How a global `currentTenant` can leak across concurrent async work
- How `AsyncLocalStorage` keeps tenant context isolated

