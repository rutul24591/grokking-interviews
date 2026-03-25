## Why this matters

If your app generates redirects (login flows, canonical URLs) and you terminate TLS upstream, you can accidentally:
- redirect users from https → http (downgrade)
- create redirect loops

Fix:
- trust proxy headers only from known proxies
- use `X-Forwarded-Proto` / `Forwarded` to compute external URL

