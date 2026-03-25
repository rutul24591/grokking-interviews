## Authentication patterns in frontends

Common patterns:
- **Session cookies (BFF)**: browser stores cookie; server holds session state
- **JWT access tokens**: stateless verification; harder revocation
- **OAuth/OIDC (PKCE)**: delegated auth; often paired with a BFF for cookies

This example focuses on **session cookies** because they:
- keep credentials out of JS (mitigates token theft via XSS)
- allow easy server-side revocation/rotation
- support server-enforced policies (idle timeout, MFA step-up)

## Key design points demonstrated
- Session id is random and additionally **signed** (defense-in-depth).
- Session store is in-memory for demo; production uses Redis/DB.
- Cookie uses `HttpOnly` + `SameSite=Lax` + `Path=/` (and `Secure` in prod).

