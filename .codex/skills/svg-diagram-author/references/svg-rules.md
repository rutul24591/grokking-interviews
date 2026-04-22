# SVG Rules

These rules are specific to this repository's documented failure modes.

## Avoid

- CSS custom properties such as `var(--color-token)`
- Unescaped `&`, `<`, or `>` inside text content
- Malformed CSS syntax
- Missing parentheses in style values
- Placeholder diagrams that do not teach anything

## Prefer

- Explicit `fill`, `stroke`, and `stroke-width`
- Transparent root background
- White or very light content panels with dark borders
- Short labels
- Stable filenames so browser caching issues are easier to manage

## Validation checklist

- Opens as plain XML without parse errors
- Text remains readable at article display size
- Labels are concise
- The diagram matches one of the allowed concept types

## Naming pattern

Prefer stable filenames such as:

- `<article-slug>-architecture.svg`
- `<article-slug>-scaling.svg`
- `<article-slug>-failover.svg`
- `<article-slug>-consistency.svg`
- `<article-slug>-performance.svg`
