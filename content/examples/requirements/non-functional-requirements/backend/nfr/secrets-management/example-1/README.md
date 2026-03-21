# Example 1 — Secrets management (key ring + rotation + `kid` token header)

## Run
```bash
pnpm install
pnpm dev
```

Agent (issues token, verifies, rotates key, verifies old+new tokens):
```bash
pnpm agent:run -- --baseUrl http://localhost:3000
```

## Files to start with
- `lib/keyring.ts`
- `app/api/tokens/issue/route.ts`
- `app/api/tokens/verify/route.ts`
- `app/api/secrets/rotate/route.ts`

