Example 1 is a production-style Next.js + Node.js article landing page optimized for above-the-fold performance.

What it demonstrates:
- Server-rendered hero content so the browser gets meaningful HTML immediately.
- Reserved image dimensions and high-priority loading for the LCP image to avoid CLS.
- Deferred third-party analytics using `next/script` with a non-blocking strategy.
- Separate origin API for article recommendations, fetched on the client after the shell is already visible.

Why this matters:
- Above-the-fold optimization is mostly about shortening the critical path to first useful paint.
- The fastest way to do that is to render the hero and primary text immediately, then defer everything else.
