## What secure cookie attributes do

For session cookies and other sensitive tokens:
- `HttpOnly`: blocks JavaScript access (reduces XSS impact)
- `Secure`: only send over HTTPS
- `SameSite`: reduces CSRF risk (not a complete CSRF solution)
- `Path` / `Domain`: scope cookies correctly

## `__Host-` prefix

`__Host-` cookies are “hardened”:
- must include `Secure`
- must not include `Domain`
- must have `Path=/`

This prevents some cookie injection / scoping attacks.

