# Example 1 — CI/CD pipeline runner with quality gates + smoke tests

## Run (manual)
```bash
pnpm install
pnpm dev
```

Agent (smoke tests against dev server):
```bash
pnpm agent:run -- --baseUrl http://localhost:3000
```

## Run (CI-style, orchestrated)
Runs `lint` → `build` → `start` → smoke tests → shuts down the server.
```bash
pnpm ci:run
```

## Files to start with
- `src/ci/run.ts`
- `app/api/health/route.ts`
- `app/api/build/route.ts`

