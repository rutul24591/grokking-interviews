# Edge case: stale updates from racing requests

In the context of Perceived Performance (perceived, performance), this example provides a focused implementation of the concept below.

“Fast typing” search, filters, or pagination can generate multiple overlapping requests.

If you don’t:
- abort old requests, or
- guard updates by sequence,

you’ll show stale results and users will perceive the UI as broken.

