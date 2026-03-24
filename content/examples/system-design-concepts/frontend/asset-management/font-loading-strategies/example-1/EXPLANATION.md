# Example 1 — Self-hosted fonts + preload + `font-display: swap` (end-to-end)

This example demonstrates a practical baseline:

- self-host fonts under `/public/fonts`
- preload the critical font file(s) for the default route
- use `font-display: swap` to avoid FOIT (Flash Of Invisible Text)
- keep a reasonable system-font fallback stack

