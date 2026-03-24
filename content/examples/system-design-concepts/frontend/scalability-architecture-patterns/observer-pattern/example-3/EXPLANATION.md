## Leak pattern

If an observer captures large objects (DOM nodes, caches, closures) and the subscription is not cleaned up, the subject’s
listener set keeps them strongly reachable.

Mitigations:
- always return an unsubscribe from subscriptions and call it during teardown
- use `AbortSignal` to couple subscription lifetime to component lifetime
- use weak references only when you fully understand the trade-offs

