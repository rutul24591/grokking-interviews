# Example 3 — ISR Edge Case: Personalization vs Shared Caching

## What it shows
- `/public` uses `revalidate` (shareable cached HTML).
- `/personalized` reads a cookie and forces dynamic rendering (no shared cache).

## Run it (after copy-paste)
```bash
pnpm install
pnpm build
pnpm start
```

Try:
- `http://localhost:3000/public`
- Set cookie: `http://localhost:3000/api/session?uid=alice`
- `http://localhost:3000/personalized`

