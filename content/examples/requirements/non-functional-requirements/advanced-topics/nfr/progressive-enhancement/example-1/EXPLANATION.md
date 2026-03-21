This is a runnable progressive-enhancement demo that intentionally supports **two modes**:

1) **No JavaScript**: the form submits with a normal POST, and the server responds with a redirect (PRG).
2) **With JavaScript**: the same form is intercepted, submits via `fetch`, and updates the UI without a full reload.

Why this matters in real systems:
- Accessibility + resiliency: slow devices, disabled JS, extensions, CSP issues, partial hydration failures.
- SEO and performance: HTML-first content, then enhance interactions.
- Operational safety: a bug in the enhancement should not break the baseline workflow.

