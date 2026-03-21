# Media optimization: the high-leverage primitives

Even before “fancy” tooling, you can dramatically reduce bytes and improve UX via:

- **Variant bucketing:** stable width buckets avoid cache fragmentation.
- **DPR-aware delivery:** crisp images without sending 2–3× unnecessary pixels.
- **Immutable caching:** a stable key + `Cache-Control: immutable` and ETags keeps repeat views cheap.

This example uses an SVG generator route so it’s runnable without external assets, but the same pattern
applies to real image pipelines (AVIF/WebP + CDN).

