Example 2 is a focused SSG pattern: **build-time search index generation**.

SSG tradeoff:
- You don’t have a runtime server for queries.

Common solution:
- Precompute a lightweight search index at build time and ship it as static JSON.
- Search runs in the browser against that precomputed index.

