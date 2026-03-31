Example 1 is a Next.js + Node.js demo showing how text assets behave under gzip and Brotli.

It demonstrates:
- An origin API that negotiates `br` or `gzip` from `Accept-Encoding`.
- A UI that compares raw bytes versus transferred bytes.
- The operational tradeoff: compression reduces transfer size for text assets but consumes CPU to encode.

