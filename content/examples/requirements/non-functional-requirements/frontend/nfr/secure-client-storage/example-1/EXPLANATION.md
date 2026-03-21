# Secure client storage: what you store defines your breach

Client storage options have different security properties:

- **HttpOnly cookies**: not readable by JS, better against XSS token theft (still needs CSRF controls).
- **localStorage**: readable by any JS on the page; if you ever have XSS, tokens are exposed.

This example intentionally demonstrates the blast radius difference by simulating exfiltration of a JS-readable token.

