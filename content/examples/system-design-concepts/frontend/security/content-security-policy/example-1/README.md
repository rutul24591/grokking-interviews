## Content Security Policy (CSP) — Example 1: Nonce-based CSP on a Next route

This example demonstrates CSP **without breaking Next dev tooling** by applying CSP to a **raw HTML route**:
- `GET /csp-demo` returns plain HTML
- the response includes a strict CSP header with a per-request **nonce**
- one inline script has the nonce (allowed), another does not (blocked)

### Run
```bash
pnpm i
pnpm dev
```

Open `http://localhost:3000`, then click “Open CSP demo”.

