# Example 2: Multi-Provider Fallback Chain

## How to Run

```bash
python demo.py
```

**Dependencies:** None — uses only Python standard library (`typing`, `dataclasses`, `datetime`, `time`, `random`).

## What This Demonstrates

This example implements a multi-provider LLM router that distributes requests across multiple API providers (OpenAI, Anthropic, self-hosted) with priority-based ordering and automatic failover. If the primary provider fails or becomes unhealthy, the request is automatically retried on the next available provider. This pattern is essential for building highly available AI applications that can survive provider outages, rate limiting, and degraded performance without impacting end users.

## Code Walkthrough

### Key Data Structures

**`ProviderConfig`** — Defines an LLM provider's properties:
- `name` — Human-readable name (e.g., `"OpenAI"`)
- `priority` — Ordering for failover (lower number = higher priority)
- `model` — Model identifier (e.g., `"gpt-4o"`)
- `max_rpm` — Maximum requests per minute the provider can handle
- `timeout_seconds` — Request timeout before the provider is considered unresponsive

**`ProviderHealth`** — Tracks a provider's health status:
- `is_healthy` — Whether the provider is currently available
- `last_check` — Timestamp of the last health check
- `consecutive_failures` — Number of failures in a row (triggers unhealthy status at 3)
- `avg_latency_ms` — Exponentially weighted moving average of response latency
- `total_requests` — Total requests sent to this provider

### Key Class

**`MultiProviderRouter`** — Routes requests across providers with failover:

**`__init__`** — Configures three providers in priority order:
1. **OpenAI** (priority 1) — Primary provider with `gpt-4o`, 1000 RPM, 30s timeout.
2. **Anthropic** (priority 2) — Secondary provider with `claude-sonnet`, 500 RPM, 30s timeout.
3. **Self-Hosted** (priority 3) — Fallback provider with `llama-3-70b`, 200 RPM, 60s timeout.

Each provider starts with a clean `ProviderHealth` record.

**`check_health(provider_name)`** — Simulates a health check:
- Updates the last check timestamp.
- Marks the provider as unhealthy if consecutive failures >= 3.
- Returns the health status.

**`get_healthy_providers()`** — Returns providers sorted by priority that are currently healthy. This is the candidate list for routing.

**`simulate_provider_call(provider_name, prompt)`** — Simulates a provider API call:
- Has a 10% simulated failure rate (random).
- On failure, increments consecutive failures and raises `TimeoutError`.
- On success, resets consecutive failures to 0, updates the exponentially weighted average latency, and returns the response with measured latency.

**`route_request(prompt)`** — The core routing method:
1. Gets the list of healthy providers sorted by priority.
2. If no providers are healthy, returns an error.
3. Iterates through providers in priority order, attempting the call on each.
4. On success, logs the result and returns the response.
5. On failure, logs the error and tries the next provider.
6. If all providers fail, returns an error with the last failure message.

**`get_provider_stats()`** — Returns health and performance statistics for all providers, including health status, average latency, total requests, and consecutive failures.

### Execution Flow (from `main()`)

1. A `MultiProviderRouter` is instantiated with a fixed random seed (42) for reproducibility.
2. Three prompts are processed through the router:
   - `"Analyze Q3 market trends"` — Routed through the provider chain.
   - `"Summarize this document"` — Routed with potential failover.
   - `"Compare architectural approaches"` — Routed with potential failover.
3. For each request, the result shows which provider was used (or an error if all failed).
4. Provider health statistics are printed showing health status, latency, request count, and failure count for each provider.

## Key Takeaways

- **Multi-provider routing eliminates single points of failure** — Relying on a single LLM provider means any outage, rate limit, or degradation directly impacts your users. A fallback chain ensures continuity.
- **Priority-based ordering balances cost and reliability** — The primary provider is typically the highest-quality model; secondary providers maintain service during outages; self-hosted models provide ultimate fallback independence.
- **Health checks prevent cascading failures** — Tracking consecutive failures and marking providers as unhealthy after a threshold prevents repeated retries on broken providers, reducing latency and error rates.
- **The 10% simulated failure rate demonstrates failover in action** — With three providers and 10% failure rate per call, the probability of all three failing is only 0.1%, giving 99.9% effective availability.
- **Production implementations need real health checks** — Instead of simulated failure, production systems should use actual test requests, latency monitoring, and provider status endpoints to determine provider health. Integration with circuit breaker patterns (e.g., Hystrix, Resilience4j) is recommended.
