This example covers an advanced progressive-enhancement pattern: **pagination that works without JS**, enhanced into **infinite scroll** when JS is available.

Baseline:
- A normal page route renders `?cursor=` pages and “Load more” is a link.

Enhanced:
- The client observes the “Load more” sentinel with `IntersectionObserver` and fetches the next page automatically.

This is a common interview-friendly pattern because it demonstrates:
- SSR friendliness and accessibility
- Caching and cursor pagination
- Enhancement that can fail safely

