## What this example covers

Frontend XSS shows up when user-controlled data becomes executable code/HTML.

This example focuses on the common real-world case: **user-generated rich text** (comments, descriptions).

## Key ideas demonstrated

### 1) Prefer “safe formats” over raw HTML
Instead of accepting arbitrary HTML from users, accept **Markdown** and render it using a controlled pipeline.

### 2) Validate/sanitize at the render boundary
Even if you “think” content is safe, treat it as untrusted at the boundary where it becomes DOM.

`rehype-sanitize` enforces an allowlist so:
- `<script>` is dropped
- dangerous attributes (`onerror`, `onclick`, …) are dropped
- URL protocols are restricted

### 3) Let React do default output encoding
React escapes text content by default, so rendering plain strings as `{text}` is safe (contextual output encoding).

## Production notes
- Don’t implement your own HTML sanitizer for production; use a battle-tested allowlist sanitizer.
- XSS prevention is defense-in-depth: sanitize + CSP + secure cookie strategy + output encoding.

