## Secure Cookie Attributes — Example 1: HTTPS cookie issuer + UI client

This example demonstrates secure cookie attributes in a realistic setup:
- a Node.js **HTTPS** server issues a session cookie with:
  - `Secure`, `HttpOnly`, `SameSite=Lax`, `Path=/`, and the `__Host-` prefix
- a Next.js UI calls the server using `credentials: "include"`

### Run

Terminal 1 (cookie server):
```bash
cd server
pnpm i
pnpm gen:cert
pnpm dev
```

Visit `https://localhost:9443/whoami` once and accept the self-signed cert warning (dev only).

Terminal 2 (web):
```bash
cd web
pnpm i
pnpm dev
```

Open `http://localhost:3000`.

