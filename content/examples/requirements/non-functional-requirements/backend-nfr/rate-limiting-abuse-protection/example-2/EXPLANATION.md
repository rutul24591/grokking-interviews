# Focus

Token buckets smooth bursts. Another common approach is a sliding/fixed window counter:

- count requests per time window (e.g. per minute)
- deny when count exceeds limit

This example demonstrates a fixed-window approximation.

