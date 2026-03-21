# Example 1 — Tamper-evident audit log (hash chain) + PII minimization

## Run
```bash
pnpm install
pnpm dev
```

Agent (creates a user + changes role, then verifies the audit chain):
```bash
pnpm agent:run -- --baseUrl http://localhost:3000
```

## Files to start with
- `lib/auditLog.ts`
- `app/api/admin/users/route.ts`
- `app/api/audit/verify/route.ts`

