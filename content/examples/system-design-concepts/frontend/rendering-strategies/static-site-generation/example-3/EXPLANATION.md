Example 3 covers an SSG edge case: **previewing draft content without rebuilding**.

SSG constraint:
- Static pages ship a snapshot.

Preview solution:
- Enable “draft mode” for authenticated preview users.
- In draft mode, pages can render dynamic draft content even if the route is otherwise static.

This example includes:
- `/api/draft?secret=dev` to enable draft mode (cookie) and redirect.
- `/api/draft/disable` to exit draft mode.

