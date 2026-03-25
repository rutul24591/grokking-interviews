## Clickjacking Prevention — Example 1: X-Frame-Options + CSP frame-ancestors

This example includes:
- a Next app with a protected page (`/protected`) that sets:
  - `X-Frame-Options: DENY`
  - `Content-Security-Policy: frame-ancestors 'none'`
- an “attacker” site on a different origin that tries to iframe the protected page

### Run

Terminal 1 (Next app):
```bash
pnpm i
pnpm dev
```

Terminal 2 (attacker server):
```bash
cd attacker
pnpm i
pnpm dev
```

Open `http://localhost:3000` and click the attacker link.

