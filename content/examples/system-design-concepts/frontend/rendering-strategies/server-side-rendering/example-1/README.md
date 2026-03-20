# Example 1 — Full SSR App (Next.js App Router + Express API)

## What it shows
- **Server-side rendered** feed + article pages.
- Personalization (cookie `uid`) and why SSR pages are often **dynamic**.
- A tiny client component (`LikeButton`) to demonstrate hydration.

## Run it (after copy-paste)
```bash
pnpm install
pnpm dev
```

- Web: `http://localhost:3000`
- API: `http://localhost:4010`

## Try it
- Open `http://localhost:3000` (SSR feed).
- Click “Set user: Alice/Bob” to set a cookie and see personalized SSR content.
- Open an article and refresh: the HTML is rendered per request.

