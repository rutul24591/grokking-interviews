# Example 3 — Advanced: preventing infinite crawl paths

Infinite-scroll implementations can accidentally create infinite URL spaces:

- unbounded query params
- cursor-based pagination exposed publicly

This example demonstrates a bounded pagination strategy and rejects invalid pages.

