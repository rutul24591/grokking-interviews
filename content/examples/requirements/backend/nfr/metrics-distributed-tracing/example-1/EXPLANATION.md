# What this example covers

Distributed tracing ties together a request across services using a shared **trace id**.

This example shows a realistic “small slice”:

- accepts an incoming W3C `traceparent` header (or creates one)
- creates a **root span** for the API request
- creates **child spans** for “cache” and “db”
- stores spans in an in-memory store and exposes a query endpoint

In production, spans go to OpenTelemetry collectors and are sampled. Metrics (counters/histograms) are exported separately.

