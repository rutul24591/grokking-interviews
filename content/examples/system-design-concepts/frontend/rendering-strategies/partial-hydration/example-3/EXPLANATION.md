Example 3 covers a common partial-hydration failure mode:

> Putting `"use client"` too high in the tree turns a whole page into a client component.

Consequences:
- larger JS bundles
- more hydration work
- slower TTI on low-end devices

This example includes two routes:
- `/bad` — entire page is a client component
- `/good` — page stays server-rendered; only a tiny leaf island hydrates

