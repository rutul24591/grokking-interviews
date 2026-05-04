# Design infinite scrolling feed with ranking — Example 1 (Production-Style HLD Demo)

Example 1 is a *full-fledged, app-shaped* implementation scaffold for this High-Level Design topic.

It is intentionally **architecture-forward** (system design interview style), but still code-backed:
- A domain model (`lib/domain.ts`) capturing the core entities.
- A request layer (`lib/api.ts`) representing backend contracts.
- A state layer (`lib/store.ts`) representing client state and caching.
- A policy layer (`lib/policies.ts`) for edge cases (rate limits, idempotency, retries, pagination).
- A runnable smoke (`app.ts`) that exercises key flows + edge checks with assertions.

This is designed to be *extendable into a UI app* later, without rewriting the core.
