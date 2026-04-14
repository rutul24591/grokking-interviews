# LangChain Callbacks for Production Monitoring

## How to Run

```bash
python demo.py
```

No external dependencies required. Uses only Python standard library (`typing`, `datetime`, `json`).

## What This Demonstrates

This example implements a custom LangChain callback handler for production observability, tracking token usage, request latency, cost calculation, error monitoring, and structured logging for every LLM and tool call in the system.

## Code Walkthrough

### Key Class

- **`ProductionCallbackHandler`**: A comprehensive callback handler that implements the LangChain callback interface. It tracks execution traces, aggregates token usage and cost, records errors, and generates monitoring reports.

### Callback Methods

1. **`on_llm_start()`**: Called when an LLM call begins. Records the model name, prompt length, and run ID. Creates the start-of-call trace entry.
2. **`on_llm_end()`**: Called when an LLM call completes. Extracts input and output token counts from the response, calculates cost using the pricing model ($2.50/M input tokens, $10.00/M output tokens), and records the end-of-call trace.
3. **`on_llm_error()`**: Called when an LLM call fails. Records the error message, error type, and run ID for debugging and alerting.
4. **`on_chain_start()`**: Called when a LangChain chain begins execution. Records the chain type and run ID.
5. **`on_tool_start()`**: Called when a tool begins execution. Records the tool name and run ID.

### Key Methods

- **`get_report()`**: Generates a monitoring summary including total traces, total tokens consumed, total cost in USD, total errors, and error rate. Also includes the last 5 errors for debugging.

### Execution Flow

1. **`main()`** creates a callback handler and prints a description of what it tracks.
2. Simulates an LLM call lifecycle:
   - `on_llm_start()` is called with model "gpt-4" and a sample prompt.
   - `on_llm_end()` is called with a simulated response containing 10 input tokens and 5 output tokens.
3. The monitoring report is generated, showing aggregated statistics.

### Important Variables

- `self._pricing`: Dictionary with input ($2.50/M tokens) and output ($10.00/M tokens) pricing rates.
- `self.traces`: Append-only log of all callback events with timestamps and run IDs.
- `self.total_tokens`, `self.total_cost`: Running aggregates across all calls.
- `self.errors`: List of error records for alerting and debugging.

## Key Takeaways

- Callback handlers are the primary mechanism for adding observability to LangChain applications without modifying the core pipeline logic.
- Token usage and cost tracking are essential for production AI systems -- LLM API costs can scale rapidly and need to be monitored alongside latency and error rates.
- Differential pricing (input vs output tokens) reflects real API pricing -- output tokens typically cost 4x more than input tokens.
- Error tracking with run IDs enables correlating errors with specific requests for debugging in distributed systems.
- Production monitoring systems should integrate callback data with external observability platforms (Datadog, Grafana, OpenTelemetry) for alerting and dashboards.
