## Why backpressure matters

In real frontends, some events fire at very high frequency (scroll, input, realtime updates). A naïve “emit → call all handlers” bus can:
- block the main thread
- amplify work (every handler runs for every event)
- create unbounded queues when handlers are slow

This example implements:
- a bounded queue
- a concurrency limit
- drop policy when overloaded (trade-off: lossy but responsive)

The goal is to model the **production trade-off**: correctness vs responsiveness.

