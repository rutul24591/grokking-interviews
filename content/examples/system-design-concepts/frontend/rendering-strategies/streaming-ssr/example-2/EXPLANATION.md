Example 2 focuses on the **React rendering primitive** behind streaming SSR: `renderToPipeableStream`.

This is intentionally not a Next.js app so you can see the streaming mechanics directly:
- `onShellReady` flushes a usable HTML shell immediately.
- A `Suspense` boundary streams its fallback first, then streams the real content when the async dependency resolves.

This maps to how frameworks (including Next.js) stream HTML for server components and async boundaries.

