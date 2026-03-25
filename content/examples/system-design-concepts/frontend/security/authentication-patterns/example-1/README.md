## Authentication Patterns — Example 1: Session-based auth (BFF) with HttpOnly cookies

This Next.js example implements a classic production pattern:
- **session-based auth** backed by a server-side session store
- client stores only an **HttpOnly cookie** (no tokens in JS-accessible storage)
- APIs authenticate by looking up the session id

### Run
```bash
pnpm i
pnpm dev
```

Open `http://localhost:3000`.

Test users:
- `alice` / `password` (admin)
- `bob` / `password` (reader)

