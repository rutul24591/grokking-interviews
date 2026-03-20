Example 2 demonstrates **on-demand revalidation**.

Problem:
- Time-based ISR means you may serve stale pages for up to N seconds after publish.

Solution:
- After a publish event, trigger revalidation explicitly:
  - `revalidateTag("content")` or `revalidatePath("/")`

This example:
- Publishes new content (`/api/publish`) without revalidating.
- Then revalidates (`/api/revalidate`) so the next request serves fresh content immediately.

