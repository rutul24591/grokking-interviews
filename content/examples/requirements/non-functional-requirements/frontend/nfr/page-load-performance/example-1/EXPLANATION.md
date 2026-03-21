# Page-load performance as an NFR

Page-load performance is the “first impression” NFR. The common staff-level levers are:

- **Split critical vs deferred work** (avoid waterfalls on the critical path).
- **Ship less JS** (lazy-load heavy widgets; keep initial hydration small).
- **Measure continuously** with RUM percentiles and budgets.

This example uses React `Suspense` to isolate slower data behind a boundary and `next/dynamic` to defer heavy client-only code.

