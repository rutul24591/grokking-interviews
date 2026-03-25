## Why CSP exists

CSP is a browser-enforced policy that reduces the blast radius of XSS by restricting:
- where scripts can load from
- whether inline scripts can execute
- where data can be sent (`connect-src`)

## What this example demonstrates

Nonce-based CSP is a common production approach:
- generate a nonce per response
- include it in `Content-Security-Policy: script-src 'nonce-…'`
- set `nonce="…"` on trusted inline scripts

This keeps inline scripts possible (for SSR bootstraps) while blocking unexpected inline scripts injected via XSS.

## Production notes
- Full-app CSP for Next dev often requires additional allowances (`unsafe-eval`) and careful handling of inline scripts.
  That’s why this example scopes CSP to a plain HTML route.
- CSP is defense-in-depth; still do sanitization/output encoding.

