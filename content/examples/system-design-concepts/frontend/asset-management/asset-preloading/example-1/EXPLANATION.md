# Example 1 — Production-shaped asset preloading

This example demonstrates **asset preloading** as a system design concern:
- preload only truly above-the-fold resources (hero image / critical CSS),
- avoid “preload everything” (wastes bandwidth and can delay critical work),
- ensure assets are **cacheable** (ETag + long `max-age` + `immutable`) so repeated navigations are fast.

It includes a server route that serves an image-like response with realistic caching headers and `304 Not Modified` behavior.

