# Example 1 — Testing pyramid on a quote flow (unit → component → E2E)

## Run
```bash
pnpm install
pnpm dev
```

Unit tests:
```bash
pnpm test:unit
```

E2E (run `pnpm dev` in another terminal):
```bash
pnpm test:e2e
```

Agent (API smoke):
```bash
pnpm agent:run -- --baseUrl http://localhost:3000
```

## Files to start with
- `lib/quote.ts`
- `components/QuoteForm.tsx`
- `lib/quote.test.ts`
- `components/QuoteForm.test.tsx`
- `e2e/quote.spec.ts`

