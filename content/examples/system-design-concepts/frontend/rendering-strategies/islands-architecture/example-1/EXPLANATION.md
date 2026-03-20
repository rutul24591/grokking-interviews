Example 1 is a Medium-like reader built with an **Islands Architecture** style in Next.js:

- The **page shell + article list** are server-rendered (fast HTML, SEO-friendly, small client JS).
- Small “islands” are client components:
  - `ReadingProgress` (scroll-based UI)
  - `BookmarkButton` (interactive state + API calls)

Production nuance included:
- The bookmark client uses **in-flight request deduplication** so 10 buttons don’t trigger 10 identical `GET /bookmarks` calls.
- State updates are optimistic and reconciled with the origin response.

