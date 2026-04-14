# Example 1: LLM Trace Collection and Analysis

## How to Run

```bash
python demo.py
```

**Dependencies:** None — uses only Python standard library (`typing`, `dataclasses`, `datetime`, `uuid`).

## What This Demonstrates

This example implements a trace collection system for LLM-powered applications, modeled after distributed tracing concepts (similar to OpenTelemetry). Each user interaction is traced as a sequence of spans representing pipeline stages — input receipt, prompt construction, retrieval, model inference, and output validation — with aggregated token counts, costs, and optional user feedback. This enables debugging cost anomalies, analyzing latency bottlenecks, and correlating model behavior with user satisfaction.

## Code Walkthrough

### Key Data Structures

**`Span`** — Represents a single pipeline stage with:
- `name` — Stage identifier (e.g., `"retrieval"`, `"llm_call"`)
- `start_time` / `end_time` — ISO 8601 timestamps
- `attributes` — Arbitrary key-value metadata (token counts, latency, model name, etc.)
- `status` — `"ok"` or `"error"`
- `children` — Nested child spans for hierarchical tracing

**`Trace`** — Represents a complete user interaction with:
- `trace_id`, `session_id`, `user_id` — Correlation identifiers
- `start_time` / `end_time` — Interaction boundaries
- `spans` — List of span objects
- `user_feedback` — Optional rating/helpfulness feedback
- `total_cost` — Aggregated cost across all spans
- `total_tokens` — Aggregated token count across all spans

### Key Class

**`TraceCollector`** — Manages a dictionary of traces keyed by `trace_id`:

**`start_trace(session_id, user_id)`** — Creates a new trace with a UUID, current timestamp, and the provided session/user identifiers. Returns the `trace_id` for subsequent span additions.

**`add_span(trace_id, name, attributes)`** — Appends a span to the specified trace. If the span attributes contain `input_tokens`, `output_tokens`, or `cost`, the trace's aggregate totals are updated automatically.

**`complete_trace(trace_id)`** — Sets the trace's `end_time` to the current timestamp.

**`add_feedback(trace_id, feedback)`** — Attaches user feedback (e.g., rating, helpfulness boolean) to the trace for later correlation analysis.

**`get_traces_by_user(user_id)`** — Filters all traces to return those belonging to a specific user, enabling per-user behavior analysis.

**`get_trace_summary(trace_id)`** — Produces a human-readable summary including truncated trace ID, session, user, span count, total tokens, formatted cost, feedback, and the pipeline stage names in order.

### Execution Flow (from `main()`)

1. A `TraceCollector` is instantiated.
2. **Trace 1 (successful interaction):** A complete trace is built with five spans — `input_received`, `prompt_construction`, `retrieval`, `llm_call`, and `output_validation`. The `llm_call` span includes detailed model, token, cost, and latency attributes. The trace is completed and user feedback (rating 4, helpful) is attached.
3. The summary for Trace 1 is printed, showing the full pipeline, token count, cost, and feedback.
4. **Trace 2 (failed interaction):** A second trace is built with three spans. The `output_validation` span has `status: "error"` and an error message about JSON parsing failure. This demonstrates how traces capture both successful and failed executions.
5. The summary for Trace 2 is printed, highlighting the error state.

## Key Takeaways

- **Traces provide end-to-end visibility** — Each trace captures the complete lifecycle of an AI request, making it possible to understand exactly what happened at every stage of the pipeline.
- **Span attributes enable cost and latency analysis** — By storing token counts and costs as span attributes, traces automatically aggregate totals, enabling queries like "which stage consumed the most tokens" or "which stage had the highest latency."
- **User feedback correlation is powerful** — Attaching feedback to traces enables analysis patterns like "traces with low feedback tend to have high retrieval latency," which directly informs optimization priorities.
- **Error traces are immediately actionable** — The error trace shows exactly which span failed and why, eliminating the need to search through multiple log sources to debug a failed request.
- **Production systems need distributed tracing backends** — The in-memory dictionary in this example should be replaced with a tracing backend (Jaeger, Zipkin, Honeycomb) that supports querying, alerting, and long-term retention.
