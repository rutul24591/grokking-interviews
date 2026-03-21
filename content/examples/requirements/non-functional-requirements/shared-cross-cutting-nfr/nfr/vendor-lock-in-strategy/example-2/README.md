# Example 2 — Adapter contract tests (focused implementation)

## What it shows
- A tiny “contract test” suite for a vendor-neutral interface (`ObjectStore`).
- How contract tests catch subtle lock-in/migration bugs (example includes a broken adapter).

## Run
```bash
pnpm install
pnpm demo
```

## Files
- `src/contracts.ts` (the contract)
- `src/stores.ts` (two adapters; one intentionally broken)
- `src/demo.ts` (runs suite and prints results)

