## Why refresh flows are tricky

Challenges:
- access tokens expire while multiple requests are in flight
- naïve clients trigger multiple refresh calls (thundering herd)
- refresh tokens must be protected from XSS (prefer HttpOnly cookies)
- refresh token reuse should be detectable (rotation + replay detection)

This example demonstrates:
- access token expiry and refresh
- client-side singleflight refresh
- server-side rotation (demo-level)

