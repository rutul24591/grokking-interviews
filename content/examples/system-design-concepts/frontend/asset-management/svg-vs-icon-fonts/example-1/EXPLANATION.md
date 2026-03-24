# Example 1 — SVG sprite pipeline (end-to-end)

This example implements a small production-style pipeline:

- Source icons live as individual SVG files under `icons/`.
- A build step generates a single `public/sprite.svg` containing `<symbol>` entries.
- The UI references icons via `<use href="/sprite.svg#icon-name" />`.

Benefits:
- 1 network request for many icons
- good caching for `sprite.svg`
- easy theming via `currentColor`

