Example 1 demonstrates **Streaming SSR** in Next.js App Router using `Suspense` boundaries.

It’s a Medium-like reader page composed of independent panels:
- **Shell** (title, controls) renders immediately.
- **Sidebar** and **Recommendations** panels fetch from a separate Node.js (Express) origin with different (slow) latencies.

Key takeaways:
- With streaming SSR, you can **flush the shell early** (better TTFB / First Paint) while slower parts stream in later.
- Each `Suspense` boundary becomes an **independent streaming unit**, so one slow dependency doesn’t block the whole page.
- In production, streaming only helps if intermediaries (CDN/proxies) **don’t buffer** the response.

