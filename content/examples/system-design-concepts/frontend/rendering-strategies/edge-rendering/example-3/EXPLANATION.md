Example 3 covers an edge-specific constraint: **many Node auth libraries don’t run at the edge**.

Instead of `jsonwebtoken` / Node `crypto`, this example implements a tiny, edge-safe signed session cookie using:
- `crypto.subtle` (Web Crypto)
- `TextEncoder` / `TextDecoder`
- base64url helpers

This is a practical pattern for edge rendering when you need lightweight authentication/identity:
- sign a compact payload
- verify at the edge in middleware / route handlers / edge-rendered pages
- forward identity to origin via headers if needed

