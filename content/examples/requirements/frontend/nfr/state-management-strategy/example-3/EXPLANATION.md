# Edge case: tearing in concurrent rendering

In the context of State Management Strategy (state, management, strategy), this example provides a focused implementation of the concept below.

As React became concurrent, external stores needed a safe read contract.

If your store integration is not concurrency-safe, you can render inconsistent UI (“tearing”) under load.

The fix is to build on `useSyncExternalStore`.

