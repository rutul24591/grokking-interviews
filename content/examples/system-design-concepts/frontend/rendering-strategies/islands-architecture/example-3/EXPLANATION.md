Example 3 covers an advanced islands pitfall: **prop serialization overhead**.

Even if you only hydrate a small island, you can still ship a lot of bytes if you pass large objects across the server→client boundary.

This example shows two modes:
- `mode=big`: server passes a large “article” object into a client island (big HTML/RSC payload)
- `mode=id`: server passes only an `id` and the island fetches details from an API route

In production, prefer “id-only” or minimal props for islands, especially on content-heavy pages.

