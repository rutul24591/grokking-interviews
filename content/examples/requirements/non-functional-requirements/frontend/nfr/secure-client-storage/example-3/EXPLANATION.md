# Cookie attributes are part of your security posture

For session cookies, common defaults:
- `HttpOnly`
- `Secure`
- `SameSite=Lax` (or `Strict` where possible)

If you need `SameSite=None`, treat CSRF protections as mandatory.

