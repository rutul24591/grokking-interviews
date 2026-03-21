# Why limiting concurrency improves efficiency

When the UI triggers many parallel calls, you can:
- compete with yourself for bandwidth,
- overload backend dependencies,
- and increase tail latency.

Concurrency limits reduce queueing and make performance more predictable.

