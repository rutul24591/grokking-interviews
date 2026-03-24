# Example 2 — Inline SVG safety (focused)

Inline SVG can be powerful, but it’s also an XSS vector when SVG comes from user input or a CMS.

This example:

- accepts an SVG string
- sanitizes it (removes scripts and event handlers)
- renders the sanitized SVG via `dangerouslySetInnerHTML`

In production, prefer a battle-tested sanitizer or a “known-good icon set” build pipeline.

