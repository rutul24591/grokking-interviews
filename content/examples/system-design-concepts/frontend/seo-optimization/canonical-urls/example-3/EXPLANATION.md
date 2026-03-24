# Example 3 — Advanced: pagination canonical rules

Pagination creates duplicates:

- `/blog` and `/blog?page=1` should canonicalize to `/blog`
- pages 2+ should canonicalize to themselves

This example demonstrates canonical rules for `page` parameters.

