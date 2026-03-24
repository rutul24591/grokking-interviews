# Example 3 — Advanced: server-driven hints via `Link` headers

Some stacks generate hints at the edge/origin using HTTP headers:
- `Link: </asset>; rel=preload; as=image`
- `Link: </chunk.js>; rel=preload; as=script`

This example shows:
- emitting `Link` hints from a route handler,
- reading them client-side for debugging,
- and a key gotcha: header-driven hints must still be correct under caching (use `Vary` where relevant).

