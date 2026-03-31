# Example 1 - Compression Negotiation

## Run it
```bash
pnpm install
pnpm dev
```

## Verify negotiation
```bash
curl -H 'Accept-Encoding: gzip' -I http://localhost:4130/payload
curl -H 'Accept-Encoding: br' -I http://localhost:4130/payload
```
