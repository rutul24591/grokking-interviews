Example 1 is an end-to-end **Server-Side Rendering (SSR)** reader app.

What you get:
- A Next.js App Router UI that renders HTML **on the server per request** (SSR).
- A separate **Node.js (Express)** API that provides feed + article detail + a “profile”.
- SSR-specific production concerns demonstrated:
  - personalization via cookies (and why it makes responses “dynamic”)
  - safe caching boundaries (`Vary` and avoiding cache poisoning)
  - avoiding SSR “waterfalls” by fetching in parallel
  - a small “hydrated” client component to show the SSR → hydration transition

Why it matters:
- SSR improves FCP/SEO, but adds server complexity: per-request compute, cache key design, upstream dependency management.

