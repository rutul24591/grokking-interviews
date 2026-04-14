# Example 2: Tool Registry with Dynamic Tool Loading

## How to Run

```bash
python demo.py
```

**Dependencies:** None beyond the Python 3 standard library. Uses only built-in modules (`typing`, `dataclasses`, `datetime`, `time`).

## What This Demonstrates

This example implements a **production-grade Tool Registry** — a centralized system for managing, categorizing, rate-limiting, and cost-tracking agent tools. It demonstrates how to **dynamically activate/deactivate tools** by category (enabling context-aware tool selection), track per-tool **cost and latency metrics**, and enforce **rate limits** to prevent resource exhaustion — all critical concerns when deploying AI agents at scale.

## Code Walkthrough

### Key Data Structures

- **`ToolMetadata` (dataclass)** — Tracks runtime statistics for each tool:
  - `call_count` — total invocations.
  - `total_latency_ms` — cumulative execution time.
  - `total_cost` — cumulative cost.
  - `last_called` — timestamp of most recent invocation.
  - `error_count` — number of failed calls.
  - `rate_limit` — optional max calls per minute.
  - `calls_this_minute` — sliding window of recent invocation timestamps.

- **`Tool` (dataclass)** — Extends the basic tool definition with production fields:
  - `cost_per_call` (float) — monetary cost per invocation.
  - `category` (string) — logical grouping (e.g., `"search"`, `"data"`, `"communication"`).
  - `metadata` (ToolMetadata) — embedded usage statistics.

### Core Class: `ToolRegistry`

| Member | Purpose |
|---|---|
| `_tools` (Dict[str, Tool]) | Master registry mapping tool names to `Tool` objects. |
| `_categories` (Dict[str, List[str]]) | Maps category names to lists of tool names. |
| `_active_tools` (set[str]) | Set of currently enabled tool names — only these are available to the agent. |

### Key Methods

**`register(tool: Tool)`** — Adds a tool to `_tools`, categorizes it under `_categories[tool.category]`, and marks it as active by default.

**`get_tool_descriptions(tool_names)`** — Generates a formatted string of tool descriptions + parameter schemas for injection into an LLM system prompt. Only includes currently active tools.

**`execute(tool_name, **kwargs)`** — The core execution path with safety checks:
1. Validates the tool exists and is active.
2. **Rate limiting**: Checks the sliding window (`calls_this_minute`). If the tool has a `rate_limit` set and the window is full, raises a `RuntimeError`.
3. **Timing**: Records `start = time.time()`, executes the tool function, calculates latency in milliseconds.
4. **Metadata update**: Increments `call_count`, adds latency, adds cost, records timestamp, appends to the rate-limit window.
5. On exception: Increments `error_count` and re-raises.

**`activate_category(category)`** — Enables all tools belonging to a named category by adding them to `_active_tools`.

**`deactivate_tool(tool_name)`** — Removes a tool from `_active_tools` without deleting it from the registry.

**`get_usage_report()`** — Returns a dict of per-tool stats (calls, average latency, total cost, errors) for tools that have been invoked at least once.

### Execution Flow (step-by-step)

1. **`main()`** creates a `ToolRegistry` instance.
2. Three tools are registered across three categories:
   - `search_knowledge_base` (category: `"search"`, cost: $0.001/call).
   - `query_database` (category: `"data"`, cost: $0.0).
   - `send_email` (category: `"communication"`, cost: $0.005/call, rate limit: 10/minute).
3. The script prints the registry overview: total tools (3), categories (`["search", "data", "communication"]`), and active tool count (3).
4. Tool descriptions are generated and printed (truncated to 500 chars) — this is the text that would be embedded in an LLM prompt.
5. **Dynamic activation**: All tools are deactivated (`_active_tools.clear()`), then only `"search"` and `"data"` categories are re-activated, leaving `send_email` unavailable.
6. `registry.execute("search_knowledge_base", query="Q3 revenue", max_results=3)` is called:
   - Passes existence and active checks.
   - No rate limit is set, so skips rate limiting.
   - Executes the lambda, records latency (~0ms), updates metadata.
   - Returns `[{"title": "Result for 'Q3 revenue'", "relevance": 0.9}]`.
7. `get_usage_report()` prints stats showing one call to `search_knowledge_base` with its latency and cost.

### Important Design Notes

- **Rate limiting** uses a sliding window of `datetime` objects, cleaned of entries older than 1 minute on each call. This is a simple but effective approach for moderate-scale systems. For high-throughput production use, a token-bucket or leaky-bucket algorithm would be preferred.
- **Category-based activation** enables the pattern of "context-aware tool loading" — e.g., a customer-support agent only gets communication tools activated, while a data-analysis agent gets database tools.
- **Cost tracking** (`cost_per_call` + `total_cost`) is essential for budgeting when agents call paid APIs (search APIs, LLM tools, etc.).

## Key Takeaways

- A **centralized Tool Registry** provides a single point of control for tool lifecycle management, observability, and safety enforcement across all agent tools.
- **Dynamic category-based activation** allows the system to expose only contextually relevant tools to the agent at any given time, reducing prompt size and preventing unintended tool usage.
- **Rate limiting** (sliding-window approach) prevents a single tool from being overused, protecting downstream services from overload or API quota exhaustion.
- **Cost and latency tracking per tool** enables budget monitoring and SLA enforcement — critical for production agents that call paid external services.
- **Tool descriptions auto-generated from the registry** ensure the LLM prompt always reflects the actual available tools and their current parameter schemas, eliminating manual prompt maintenance.
- In production, the rate-limiting logic would likely be replaced with a distributed rate limiter (e.g., Redis-backed) and cost tracking would integrate with a billing system.
