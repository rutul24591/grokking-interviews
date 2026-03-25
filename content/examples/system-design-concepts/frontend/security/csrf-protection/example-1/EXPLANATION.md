## What CSRF is

CSRF (Cross-Site Request Forgery) is when a malicious site causes a user’s browser to perform a state-changing request to
your site **with the user’s cookies automatically attached**.

CSRF requires:
- cookies (or other ambient authority) used for auth
- a state-changing endpoint

## Defenses demonstrated

### 1) Origin validation
For browser-initiated requests, validate `Origin` (and optionally `Referer` as a fallback).

### 2) Synchronizer token
Require a secret, per-session token that the attacker cannot read cross-origin.

This example stores the token in an HttpOnly cookie and embeds it into the rendered HTML. The client echoes it back via
`X-CSRF-Token`.

## Trade-offs
- Token management adds complexity (rotation, multi-tab forms).
- SameSite cookies help but are not the only defense—still do origin + token for high-value actions.

