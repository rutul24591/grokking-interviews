## Authorization (RBAC) — Example 1: Role → permissions enforced on the server

This Next.js example demonstrates production RBAC:
- users authenticate and get a session cookie
- server evaluates permissions for each API
- UI hides/greys actions, but **server is the source of truth**

### Run
```bash
pnpm i
pnpm dev
```

Test users:
- `alice` / `password` (admin)
- `bob` / `password` (editor)
- `carol` / `password` (reader)

