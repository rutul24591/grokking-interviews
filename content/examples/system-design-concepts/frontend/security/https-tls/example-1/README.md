## HTTPS/TLS — Example 1: Local TLS server + UI probe

This example contains:
- `server/`: Node.js **HTTPS** server (TLS termination) + HTTP→HTTPS redirect
- `web/`: Next.js UI that probes `https://localhost:8443/health`

### Run

1) Generate a local dev cert (requires `openssl`):
```bash
cd server
pnpm i
pnpm gen:cert
```

2) Start the TLS server:
```bash
pnpm dev
```

3) Start the web UI:
```bash
cd ../web
pnpm i
pnpm dev
```

Open `http://localhost:3000`.

### Important (self-signed cert)
The first time, open `https://localhost:8443/health` in your browser and accept the certificate warning so subsequent
fetches can succeed.

