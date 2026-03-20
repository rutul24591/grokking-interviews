Example 2 is a focused SSR optimization: **avoid server data-fetch waterfalls**.

The setup:
- A server-rendered page needs `trending` and `recommended`.
- In sequential mode, the server waits for one API call before starting the other.
- In parallel mode, the server fetches both concurrently and reduces TTFB.

This is a common production SSR win:
- Reduce request latency without changing the UI by fixing the server critical path.

