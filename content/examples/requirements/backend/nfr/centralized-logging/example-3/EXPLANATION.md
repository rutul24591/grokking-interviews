# Edge case: metric cardinality explosions

In the context of Centralized Logging (centralized, logging), this example provides a focused implementation of the concept below.

High-cardinality dimensions (userId, requestId) belong in logs/traces, not metrics.

Use route templates and coarse labels for metrics to keep time-series backends stable.

