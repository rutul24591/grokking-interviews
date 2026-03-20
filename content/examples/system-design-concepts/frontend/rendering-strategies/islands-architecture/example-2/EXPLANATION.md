Example 2 focuses on an islands optimization: **hydrate/load an island only when it becomes visible**.

Even if your page is mostly server-rendered, a few islands can still be expensive if they ship large JS or do heavy work on mount.

This example:
- Server-renders a long article.
- Replaces the “Comments” island with a lightweight placeholder.
- Uses `IntersectionObserver` to dynamically import and mount the real comments island only when it scrolls into view.

