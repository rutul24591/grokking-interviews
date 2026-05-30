# Explanation

This example supports Design Web Worker Computation. It demonstrates the worker pool and message protocol, protects the invariant "CPU-heavy work must leave the UI thread responsive while preserving cancellation and result ordering.", and covers the edge case where a large computation is cancelled while a worker has already posted partial progress and transferred buffers. Use it to discuss browser support, permissions, cleanup, fallback UX, and observability.
