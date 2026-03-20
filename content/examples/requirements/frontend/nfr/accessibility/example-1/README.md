# Example 1 — Accessibility Gate (a11y contracts + audits)

## What it shows
- Turning accessibility into **executable contracts** (rules + audits).
- Auditing common failure modes: missing labels, missing button type, missing dialog naming.

## Run
```bash
pnpm install
pnpm dev
```

Agent:
```bash
pnpm agent:run -- --baseUrl http://localhost:3000
```

## Files to start with
- `app/api/audit/route.ts`
- `lib/audit.ts`
- `src/agent/run.ts`

