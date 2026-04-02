# Example 3 — Migration playbook: dual-write + backfill + verify + read-repair

## What it shows
- A runnable simulation of a common vendor-exit pattern:
  1) **Dual-write** new traffic to both providers
  2) **Backfill** historical data in batches with a checkpoint
  3) **Verify** checksums before cutover
  4) Use **read-repair** to smooth the tail during cutover

## Run
```bash
pnpm install
pnpm demo
```

## Files
- `src/migration.ts` (backfill batch, read-repair, verification)
- `src/store.ts` (simple store + checksums)
- `src/demo.ts` (end-to-end simulation)

