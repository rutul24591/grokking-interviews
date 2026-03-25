## Why URLs are an XSS surface

Even if you sanitize HTML, attackers can sometimes inject URLs:
- `javascript:alert(1)`
- `data:text/html,...`
- protocol-relative URLs with unexpected behavior

Production guidance:
- allowlist protocols (`https:`, maybe `http:` for dev)
- normalize and validate before rendering clickable links

