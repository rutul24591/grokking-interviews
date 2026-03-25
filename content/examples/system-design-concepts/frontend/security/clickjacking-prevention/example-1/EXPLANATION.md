## What clickjacking is

Clickjacking is UI redressing: an attacker overlays your site inside an iframe and tricks users into clicking
hidden/shifted buttons (e.g., “transfer money”, “authorize app”).

## Defenses demonstrated
- `X-Frame-Options: DENY` (legacy but widely supported)
- `CSP frame-ancestors 'none'` (modern, more expressive)

Use CSP `frame-ancestors` when you need allowlists (trusted embed partners).

