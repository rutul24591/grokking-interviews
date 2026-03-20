# Example 3 — Streaming SSR vs Buffering Proxies

## Run it
```bash
pnpm install
pnpm start
```

Then compare:
```bash
curl -N http://localhost:3061   # streaming proxy
curl -N http://localhost:3062   # buffering proxy
```

You should see `chunk 1/5`, `chunk 2/5`, ... arrive incrementally for the streaming proxy, while the buffering proxy delivers everything at the end.

