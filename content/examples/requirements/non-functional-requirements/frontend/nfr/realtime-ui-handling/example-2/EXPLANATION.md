# Avoiding reconnect storms

In the context of Realtime Ui Handling (realtime, ui, handling), this example provides a focused implementation of the concept below.

When a backend cluster restarts, thousands of clients may reconnect at once.

Exponential backoff + jitter:
- spreads load,
- reduces thundering herds,
- and improves tail latency during recovery.

