# Explanation

This example supports Design a Background Sync System. It demonstrates the service worker backed retry coordinator, protects the invariant "Failed user intent must survive page close and replay without duplicate server side effects.", and covers the edge case where a service worker update happens while a queued mutation has been sent but not acknowledged. Use it to discuss browser support, permissions, cleanup, fallback UX, and observability.
