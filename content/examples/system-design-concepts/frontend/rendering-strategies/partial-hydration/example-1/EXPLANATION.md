Example 1 demonstrates **Partial Hydration** using Next.js Server Components + Server Actions:

- The page (article content, counters) is **server-rendered**.
- Only the Like button is a client island (`"use client"`) to show pending UI.

Key idea:
> Keep client components as small “leaves” so you don’t accidentally pull large subtrees into the client bundle.

This pattern is common for content-heavy apps (Medium-like):
- render article + related content on the server
- hydrate only interaction hotspots (like, bookmark, follow, comment composer)

