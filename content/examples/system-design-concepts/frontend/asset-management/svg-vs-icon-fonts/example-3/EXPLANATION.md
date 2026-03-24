# Example 3 — CSP and icon delivery trade-offs (advanced)

In real systems, security policies can constrain icon delivery:

- strict CSP may block `data:` image URLs unless allowed
- inline SVG can require careful sanitization and policy tuning
- external sprites/components can work cleanly under strict CSP

This example sets a restrictive CSP and shows an external sprite icon alongside a `data:` SVG icon.

