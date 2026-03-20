# Example 1 — Full CSR App (Next.js + Express API)

## What it shows
- A Medium-like reader experience implemented as **pure CSR** (client fetch + client render).
- An **Express** API with ETag caching and realistic failure/latency knobs.
- Practical patterns you can reuse in production:
  - AbortController cancellation on new search / navigation
  - request dedupe + small TTL cache
  - retry/backoff for transient failures

## Run it (after copy-paste)
```bash
pnpm install
pnpm dev
```

- Web: `http://localhost:3000`
- API: `http://localhost:4000`

## Useful knobs
- Add latency: `http://localhost:4000/articles?latencyMs=600`
- Force failure: `http://localhost:4000/articles?fail=1`
- Search: `http://localhost:4000/articles?q=react`

