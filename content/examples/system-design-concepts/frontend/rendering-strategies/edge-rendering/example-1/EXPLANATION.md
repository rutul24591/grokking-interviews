Example 1 is an end-to-end **Edge Rendering** demo using Next.js App Router with `runtime = "edge"`.

What you get:
- A Next.js page that **renders at the edge** and calls a separate Node.js (Express) origin API.
- A `middleware.ts` (also edge runtime) that:
  - issues a stable `uid` cookie
  - assigns a deterministic experiment bucket (`A`/`B`)
  - forwards identity via headers to the edge-rendered page

Why it’s interview-relevant:
- “Edge rendering” is mostly about **moving latency-sensitive logic closer to users** while accepting edge constraints:
  - Web APIs only (no `fs`, no native modules, limited Node APIs)
  - smaller bundles, faster cold starts
  - careful caching: edge HTML/JSON can be shared-cached, but **personalization must vary safely**

