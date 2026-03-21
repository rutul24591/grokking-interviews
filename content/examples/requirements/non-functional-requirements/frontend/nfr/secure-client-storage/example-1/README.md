# Example 1 — HttpOnly cookie vs localStorage token (XSS blast radius)

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
- `app/api/auth/login-cookie/route.ts`
- `app/api/auth/secret/route.ts`
- `components/AttackPanel.tsx`

