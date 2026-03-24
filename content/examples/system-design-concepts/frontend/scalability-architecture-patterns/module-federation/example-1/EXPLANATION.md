## What Module Federation solves

Module Federation enables **runtime composition** of separately built and deployed frontends:
- multiple teams ship independently
- the host loads remote modules dynamically
- shared deps (React) can be deduped

## Production trade-offs

Benefits:
- independent deployability
- incremental migration (strangler)
- shared UI and capabilities without a huge monolith

Costs:
- complex versioning and compatibility management
- runtime failure modes (remote unavailable)
- harder local dev + caching issues

This example is intentionally small, but shows the core mechanics:
- `remote` exposes `./Button`
- `host` imports `remoteApp/Button` with `React.lazy`
- share config uses singleton React to avoid loading two copies

