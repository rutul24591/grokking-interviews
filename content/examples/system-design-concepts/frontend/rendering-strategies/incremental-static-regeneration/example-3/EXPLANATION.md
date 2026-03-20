Example 3 covers an ISR edge case: **don’t cache personalized HTML**.

Key idea:
- ISR caches pages to be shared.
- Personalization (cookies/session) makes HTML user-dependent → caching must vary by user or be disabled.

This example includes:
- `/public` — safe to cache with ISR
- `/personalized` — reads a cookie, so it’s dynamic and should not use shared caching

