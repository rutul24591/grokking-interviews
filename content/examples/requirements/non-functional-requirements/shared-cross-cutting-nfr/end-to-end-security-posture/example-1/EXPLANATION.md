# End-to-End Security Posture — what “good” looks like in code

This example intentionally stays small, but it demonstrates how *security posture* is an end-to-end property:

- **Frontend**: minimizes attack surface and does not accidentally leak secrets.
- **Backend APIs**: validate inputs, authenticate callers, authorize operations, and reject unsafe contexts.
- **Platform/runtime**: enforce secure defaults (headers, cookies, cache-control), limit abuse, and provide auditability.

## Threat model (explicitly stated)

Assume:
- Attackers can send arbitrary HTTP requests to your APIs.
- Attackers can try credential stuffing and brute force.
- Attackers can attempt CSRF (cross-site form/fetch attempts).
- Bugs can lead to excessive data exposure (e.g., logging secrets or caching sensitive responses).

Out of scope here (but commonly required in production):
- MFA, SSO/OIDC, device binding.
- Real database, encryption at rest, key management/HSM.
- WAF, bot management, and multi-region failover.

## Posture controls implemented

### 1) Secure response headers (platform control)
Configured in `next.config.ts`:
- **CSP** prevents a large class of injection and clickjacking issues.
- **X-Frame-Options: DENY** and **frame-ancestors 'none'** block framing.
- **nosniff**, referrer policy, and permission policy reduce data leakage.

Trade-off: in **dev**, Next uses patterns that often require `'unsafe-eval'` / `'unsafe-inline'`. The config is documented as “dev-friendly” to keep the app runnable; production posture should tighten these.

### 2) Input validation (application control)
Every mutation uses **Zod** schemas:
- Login payload is validated (`email`, `password`).
- Note creation has bounds on title/body sizes.

This prevents:
- unexpected shapes (prototype pollution style surprises),
- unbounded payload costs,
- and “stringly typed” security bugs.

### 3) Sessions: signed cookie + server-side session store
`lib/session.ts` issues:
- A **signed token** placed in an **HttpOnly** cookie.
- A server-side **session store** that holds `{sid, userId, csrfToken, expiresAt}`.

Why both?
- Cookies are good for transport and browser ergonomics.
- A server-side store gives you **revocation** (logout), compromise response, and metadata (createdAt, expiry).

### 4) CSRF: same-origin + per-session token
Mutations require:
- same-origin context (`Origin` / `Sec-Fetch-Site`), and
- a per-session token in `x-csrf-token`.

Why a header token?
- Browsers do **not** allow cross-site pages to set custom headers on your origin due to SOP.
- Your API can reject requests that only contain ambient credentials (cookies).

### 5) Abuse controls: rate limiting
Login is limited to **5/minute/IP** in `app/api/auth/login/route.ts`.
Notes writes are limited to **30/minute/(IP + user)** in `app/api/notes/route.ts`.

Trade-off: this is an in-memory limiter for a single node. Production would typically move this to:
- Redis / in-memory shared store,
- API gateway rate limits,
- or bot management/WAF, with per-tenant/per-user policies.

## How to extend to “real production”
- Replace the in-memory stores with durable storage and add authorization rules.
- Use a proper identity provider (OIDC) and enforce MFA.
- Implement **audit logging** and make it queryable (and redact PII by policy).
- Add SAST/DAST, dependency scanning, and a secure CI pipeline.
- Threat model per endpoint and add tests like `src/agent/run.ts` for invariants (headers, auth, CSRF).

