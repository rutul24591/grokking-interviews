# Example 1 — Origin + CDN separation (end-to-end)

This example runs:

- a **CDN-like static server** (Node/Express) on `:4001` serving `/assets/*`
- a **Next.js app** on `:3000` that loads images from the CDN origin

It demonstrates:

- separating **HTML/API origin** from **static asset origin**
- setting CDN-friendly caching headers (`immutable` for content-hashed assets)
- `preconnect` to reduce connection setup latency
- configuring Next `images.remotePatterns` for CDN-hosted images

