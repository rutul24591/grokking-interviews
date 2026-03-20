Example 1 is an end-to-end **Static Site Generation (SSG)** app with a realistic build pipeline.

What you get:
- A Next.js App Router site that pre-renders a feed + post pages at **build time**.
- A Node.js build step (`scripts/build-content.ts`) that turns Markdown-like source files into `content/posts.json`.
- `generateStaticParams` for deterministic route generation and “no runtime DB/CMS dependency”.

Why it matters:
- SSG’s “server” is your **build pipeline**. Reliability, determinism, and correctness of the build step matter as much as runtime correctness.

