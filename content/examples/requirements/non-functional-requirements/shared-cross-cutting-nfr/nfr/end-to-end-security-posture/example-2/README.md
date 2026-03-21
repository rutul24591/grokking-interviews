# Example 2 — Same-origin + CSRF guard (focused implementation)

## What it shows
- A small, testable “mutation guard” you can reuse across routes.
- Combining `Origin` allowlists, `Sec-Fetch-Site`, and a per-session CSRF token.

## Run
```bash
pnpm install
pnpm demo
```

## Files
- `src/guard.ts` (the guard)
- `src/demo.ts` (table-driven checks)

