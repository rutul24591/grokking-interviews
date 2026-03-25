## Why validation belongs on the server

Client validation improves UX, but it is not a trust boundary.

Production requirements:
- treat all network input as untrusted
- validate shape, types, and bounds
- normalize canonical forms before persistence

This example:
- uses a strict schema (`.strict()`) so unknown keys fail fast
- trims and normalizes strings
- enforces length bounds to prevent abuse (DoS / log bloat)

