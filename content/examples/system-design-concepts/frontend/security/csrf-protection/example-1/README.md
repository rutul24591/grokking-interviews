## CSRF Protection — Example 1: Synchronizer token (HttpOnly cookie + SSR embed)

This Next.js example demonstrates a production CSRF pattern:
- server sets a **CSRF token** in an **HttpOnly** cookie (middleware)
- server renders the token into the page (SSR)
- client sends the token back in a header for state-changing requests
- server verifies **Origin** + token match

### Run
```bash
pnpm i
pnpm dev
```

Open `http://localhost:3000` and submit the “transfer” form.

