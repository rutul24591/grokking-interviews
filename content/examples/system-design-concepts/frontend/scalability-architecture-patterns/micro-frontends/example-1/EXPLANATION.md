# Example 1 — Micro-frontend via iframe + postMessage contract (end-to-end)

Demonstrates:

- a **shell** (Next.js) embedding a separately-served micro-app (Node server) via `<iframe>`
- a **versioned postMessage contract** with origin allowlisting
- production trade-offs: isolation (CSS/JS), independent deploys, and cross-app communication

