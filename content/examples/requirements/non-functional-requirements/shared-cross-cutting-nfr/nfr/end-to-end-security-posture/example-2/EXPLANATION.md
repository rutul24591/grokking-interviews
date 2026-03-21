# Why this matters

In real systems, CSRF isn’t a single “toggle” — it’s a set of defenses that must align:

- **Cookie settings** (HttpOnly, SameSite, Secure) reduce ambient credential abuse.
- **Same-origin checks** (`Origin`, `Sec-Fetch-Site`) reject cross-site contexts.
- **Per-session tokens** protect mutation endpoints when cookies exist.

This example isolates the logic into a small function (`enforceSameOriginCsrf`) so it’s:
- easy to reason about,
- easy to test,
- and consistent across endpoints.

Production note: enforce allowlists (not “string contains”) and keep a clear policy for requests without `Origin` (e.g., CLI clients vs. browsers).

