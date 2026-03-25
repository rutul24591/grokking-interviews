## Token Refresh Strategies — Example 1: Access token + rotating refresh token

This Next.js example implements a common production approach:
- short-lived **access token** (kept in memory)
- long-lived **refresh token** in an HttpOnly cookie
- refresh endpoint rotates refresh tokens (replay detection hook)
- client uses a “singleflight” refresh to avoid thundering herd

### Run
```bash
pnpm i
pnpm dev
```

Open `http://localhost:3000`.

