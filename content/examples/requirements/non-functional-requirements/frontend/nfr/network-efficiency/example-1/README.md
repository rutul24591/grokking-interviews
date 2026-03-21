# Example 1 — ETag revalidation + request coalescing

## Run
```bash
pnpm install
pnpm dev
```

Agent (304 verification):
```bash
pnpm agent:run -- --baseUrl http://localhost:3000
```

## Files to start with
- `app/api/feed/route.ts`
- `lib/client/feedClient.ts`
- `lib/client/dedupe.ts`

