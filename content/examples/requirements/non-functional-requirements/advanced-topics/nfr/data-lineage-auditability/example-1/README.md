# Example 1 — Lineage Ledger (Next.js UI + audit ledger + Node agent)

## What it shows
- Append-only **audit ledger** with a **hash chain** (tamper-evident).
- Recording **lineage edges** for a transformation pipeline.
- Verifying the ledger and exporting an “evidence bundle”.

## Prereqs
- Node.js 20+ recommended (Node 18+ should work).
- `pnpm` installed.

## Run
### 1) Start the app
```bash
pnpm install
pnpm dev
```
Open `http://localhost:3000`.

### 2) Run a pipeline from the agent (new terminal)
```bash
pnpm agent:run -- --baseUrl http://localhost:3000 --job daily-aggregate
```

## Files to start with
- `lib/ledger.ts` (hash-chained audit log)
- `lib/pipeline.ts` (transforms + lineage events)
- `app/api/job/run/route.ts` (orchestrates a run)
- `src/agent/run.ts` (exports evidence bundle)

