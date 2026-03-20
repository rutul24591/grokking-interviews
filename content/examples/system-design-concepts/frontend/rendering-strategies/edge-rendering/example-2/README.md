# Example 2 — Edge Middleware: Region Routing via Rewrite

## Run it (after copy-paste)
```bash
pnpm install
pnpm dev
```

Try:
```bash
curl -i http://localhost:3000
curl -i -H 'x-region: eu' http://localhost:3000
curl -i 'http://localhost:3000?region=eu'
```

