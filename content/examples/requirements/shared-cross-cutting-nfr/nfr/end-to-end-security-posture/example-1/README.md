# Example 1 — Secure Notes (Next.js security posture across UI + APIs)

## What it shows
- Defense-in-depth: security headers, input validation, auth/session, CSRF, and rate limiting.
- Signed **session cookie** + server-side **session store** (logout/revocation).
- Mutations protected with **same-origin checks** and a **per-session CSRF token**.

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

### 2) Use the demo credentials
- Email: `staff@example.com`
- Password: `password12345`

### 3) Run the agent (new terminal)
```bash
pnpm agent:run -- --baseUrl http://localhost:3000
```

## Files to start with
- `next.config.ts` (security headers + CSP)
- `lib/session.ts` and `lib/store.ts` (signed sessions + revocation + CSRF token)
- `app/api/auth/*` and `app/api/notes/*` (guards + validation)
- `src/agent/run.ts` (end-to-end assertions)

