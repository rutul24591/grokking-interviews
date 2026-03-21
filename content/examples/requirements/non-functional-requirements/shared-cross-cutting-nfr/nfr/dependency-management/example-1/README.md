# Example 1 — Dependency governance (policy + proposals + audit)

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
- `lib/semver.ts` (major/minor/patch classification)
- `lib/policy.ts` (license/advisory rules)
- `app/api/proposals/*` (workflow)

