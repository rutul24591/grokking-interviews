## HTTPS/TLS — Example 3: HTTPS redirect behind a proxy (`X-Forwarded-Proto`)

This script demonstrates a common edge case:
- TLS terminates at an edge proxy
- the app sees plain HTTP
- redirects must use `X-Forwarded-Proto` (and only if you trust the proxy)

### Run
```bash
pnpm i
pnpm start
```

