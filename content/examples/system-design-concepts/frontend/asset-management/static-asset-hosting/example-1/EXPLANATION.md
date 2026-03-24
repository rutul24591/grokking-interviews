# Example 1 — Public + private assets with signed URLs (end-to-end)

This example runs:

- an **asset server** (Node/Express) on `:4020`
- a **Next.js app** on `:3000` that:
  - serves HTML/API
  - generates **signed URLs** for private assets

This models a common production setup:

- Public assets: long-lived cache, potentially CDN-backed.
- Private assets: stable URLs + short TTL + signature (`HMAC`) + `Cache-Control: no-store`.

