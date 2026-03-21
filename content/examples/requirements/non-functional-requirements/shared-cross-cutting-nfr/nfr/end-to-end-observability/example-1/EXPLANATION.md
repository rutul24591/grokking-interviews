This is a runnable “Trace Lab” that demonstrates **end-to-end observability**:

- **Context propagation** using the W3C `traceparent` header.
- A multi-hop request path (simulating service-to-service calls) where each hop creates a span.
- An in-memory span store you can query by `traceId`.
- A Node agent that generates requests and validates that spans share the same `traceId` and have correct parent relationships.

Production mapping:
- Frontend/backend/services must agree on a propagation format (`traceparent`, `baggage`).
- Every hop should emit spans + structured logs with consistent correlation IDs.
- You can add sampling (head- or tail-based) without changing application logic.

