Example 1 is an end-to-end **Client-Side Rendering (CSR)** reader app.

What you get:
- A Next.js UI that renders *everything* on the client (no SSR for the page).
- A Node.js (Express) API that serves a feed + article detail, with realistic knobs:
  - pagination + search
  - simulated latency + failure injection
  - ETag-based caching and `304 Not Modified`
- A small client fetch layer that demonstrates CSR production concerns:
  - request cancellation (AbortController)
  - in-flight request deduplication
  - basic retry with exponential backoff for transient failures

Why it matters for CSR interviews:
- CSR is mostly about **shipping JS + managing client runtime constraints** (network, CPU, memory, UX).
- The “backend API” is often stable; the tricky part is correct, resilient, *user-perceived* performance in the browser.

