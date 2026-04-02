# Frontend Observability (RUM) — Design notes

## Why “RUM” is a frontend NFR
Real-user monitoring is the only way to quantify experience on **real devices**, across **variable networks**, browsers, extensions, and third-party scripts. It turns “it feels slow” into measurable signals you can trend and alert on.

## Pipeline shape
1. **Client capture**
   - Errors (`error`, `unhandledrejection`)
   - Performance entry types (when available): `paint`, `largest-contentful-paint`, `layout-shift`
2. **Ship**
   - Prefer `navigator.sendBeacon()` (background-safe, lower UX impact).
   - Fallback to `fetch(..., { keepalive: true })`.
3. **Ingest**
   - Validate with `zod` to avoid “telemetry becomes your new attack surface”.
   - Apply simple limits (max events per request) and store in a bounded ring buffer.
4. **Aggregate**
   - Keep a couple high-signal rollups: event counts by type, p95 of a key metric, and “top errors”.

## Trade-offs and hard parts (what you’d do in production)
- **Sampling:** deterministic sampling by session/user keeps cohorts stable and prevents “random flapping”.
- **Privacy:** scrub URLs and avoid capturing PII (query strings, form values, email addresses, tokens).
- **Backpressure:** telemetry must never take down your app; apply quotas and drop policies.
- **Joinability:** to debug, you need correlation (session id, page, release version) and sometimes user id (hashed).

