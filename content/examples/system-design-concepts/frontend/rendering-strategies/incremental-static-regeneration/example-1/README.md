# Example 1 — Time-Based ISR (Next.js + Express Content API)

## What it shows
- `revalidate = 10` seconds for a cached page.
- Content origin (Express) can change at any time (“publish”).
- The page updates only after the revalidate window expires.

## Run it (after copy-paste)
Dev mode does not represent ISR caching accurately. Use prod mode:
```bash
pnpm install
pnpm build
pnpm start
```

- Web: `http://localhost:3000`
- API: `http://localhost:4020`

## Try it
- Open the page, note the content version.
- Click **Publish new version**.
- Refresh immediately: you may still see the old version until revalidation occurs.

