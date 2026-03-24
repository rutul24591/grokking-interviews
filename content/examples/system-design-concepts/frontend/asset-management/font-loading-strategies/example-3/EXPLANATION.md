# Example 3 — Cross-origin font hosting + CORS

Advanced deployments often host fonts on a dedicated static origin / CDN:

- `https://cdn.example.com/fonts/*`

This requires:

- correct `Access-Control-Allow-Origin` headers (CORS)
- `<link rel="preconnect">` and `crossorigin` for better connection reuse
- careful cache headers (fonts are large; version them!)

This example runs a small font CDN server and loads fonts cross-origin via `@font-face`.

