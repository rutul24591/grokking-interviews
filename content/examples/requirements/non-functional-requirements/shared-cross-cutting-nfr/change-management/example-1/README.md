# Example 1 — Change Control (approvals + freeze windows + audit log)

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
- `lib/policy.ts` (risk → approvals + freeze rules)
- `app/api/changes/*` (workflow)
- `src/agent/run.ts` (policy validation runner)

