# Why this matters

Accessibility failures are often *systematic*:
- unlabeled form fields,
- modal/dialogs without accessible naming,
- and subtle form behaviors (buttons without explicit `type`).

This example demonstrates a pragmatic approach:
1. Define the **rules** you care about (as code).
2. Audit patterns consistently (API endpoint).
3. Keep the checks easy to run in CI (agent).

In production, you should pair this with browser-level tooling (axe/Playwright) and design-system components, but “contracts” remain valuable for making expectations explicit.

