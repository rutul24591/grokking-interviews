# Offline support (PWA) as a frontend NFR

Offline support is not “make everything work without internet”. It’s deciding which journeys must remain usable under:
- flaky mobile networks,
- captive portals,
- background tab throttling,
- and transient backend incidents.

## What this example implements
- **Offline fallback page** cached on install.
- **Stale-while-revalidate caching** for a read-only API (`/api/notes`).
- A simple UI to demonstrate “cache warm → offline → still usable”.

## Production-grade extensions
- Queue writes (outbox) and replay when online (with idempotency keys).
- Prevent caching of sensitive endpoints.
- Add versioned caches and safe invalidation on deploy.

