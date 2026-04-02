# Focus

Invalidation is the hardest part of caching.

One approach is tag-based invalidation:

- cache entries have tags (e.g. `user:u1`, `post:p9`)
- on writes, invalidate by tag

This example models a simple tag index.

