## What this demonstrates

HTTPS is HTTP over TLS. In production, TLS is often terminated at:
- CDN / edge
- load balancer / ingress
- API gateway

This example models the “TLS termination” piece in a runnable way:
- an HTTPS server exposes `/health` and returns TLS details (protocol + cipher)
- an HTTP server redirects to HTTPS
- the UI calls the HTTPS endpoint and displays the results

## Production notes
- Don’t use self-signed certs in prod; use an ACME CA or managed certificates.
- Set TLS minimum versions/ciphers explicitly and review periodically.
- HSTS is powerful and should be rolled out carefully (especially `includeSubDomains` and preload).

