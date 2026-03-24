## Focused sub-problem: routing and fan-out cost

In pub/sub, the broker’s work is:
- match message topic to subscriptions
- fan out to N subscribers

At scale, this becomes:
- CPU work (topic matching)
- memory pressure (subscriber sets)
- tail latency (slow subscribers)

This demo keeps it simple and highlights where backpressure and isolation would be added.

