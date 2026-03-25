## Why cookie prefixes help

Prefixes add additional constraints enforced by browsers:
- `__Secure-`: must be set from a secure origin and include `Secure`
- `__Host-`: must include `Secure`, must be host-only (no Domain), and must be `Path=/`

They reduce some scoping attacks and make review easier.

