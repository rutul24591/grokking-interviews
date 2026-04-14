# Example 3: Rate Limiter with Request Queuing for AI APIs

## How to Run

```bash
python demo.py
```

**Dependencies:** None — uses only Python standard library (`typing`, `dataclasses`, `datetime`, `time`, `collections`).

## What This Demonstrates

This example implements a token bucket rate limiter with request queuing for AI API calls. It controls the rate at which requests are sent to an LLM provider using a token bucket algorithm, queues excess requests when the rate limit is approached, and processes the queue as tokens become available. This prevents API quota exhaustion, avoids rate-limit errors from providers, and ensures graceful degradation under traffic bursts rather than abrupt request rejection.

## Code Walkthrough

### Key Data Structure

**`QueuedRequest`** — Represents a request waiting in the queue:
- `id` — Unique request identifier
- `user_id` — The user who submitted the request
- `prompt` — The prompt text
- `queued_at` — ISO 8601 timestamp when the request was queued
- `priority` — Priority level (higher = more urgent), enabling priority-based processing

### Key Class

**`RateLimiter`** — Token bucket rate limiter with queuing:

**`__init__`** — Configures the token bucket:
- `max_tokens` (default 100) — Maximum token capacity of the bucket.
- `refill_rate` (default 10.0) — Tokens added per second.
- `queue_size` (default 1000) — Maximum queue length; requests beyond this are rejected.
- `tokens` — Current available tokens (starts at `max_tokens`).
- `last_refill` — Timestamp of the last token refill calculation.
- `queue` — A deque with fixed maximum length for holding queued requests.
- `processed` / `rejected` — Counters for completed and rejected requests.

**`_refill()`** — Calculates elapsed time since the last refill and adds `elapsed * refill_rate` tokens to the bucket, capped at `max_tokens`. This implements the continuous refill behavior of the token bucket algorithm.

**`try_acquire(tokens=1)`** — Attempts to consume tokens:
1. Calls `_refill()` to update the token count.
2. If enough tokens are available, deducts them and returns `True`.
3. Otherwise returns `False` (rate limit reached).

**`enqueue(request)`** — Adds a request to the queue:
- If the queue is full (at `maxlen`), increments the rejected counter and returns `False`.
- Otherwise appends the request and returns `True`.

**`process_queue(process_fn)`** — Processes queued requests as tokens become available:
- While the queue is non-empty and tokens are available, dequeues the next request, calls `process_fn` on its prompt, and records the result.
- Increments the processed counter for each successful execution.
- Returns a list of results with request IDs and status.

**`get_stats()`** — Returns current limiter statistics: available tokens, queue size, processed count, rejected count, and utilization percentage (how full the bucket has been).

### Execution Flow (from `main()`)

1. A `RateLimiter` is configured with 5 max tokens, a refill rate of 2.0 tokens/second, and default queue size.
2. **Burst simulation:** 15 requests are submitted simultaneously:
   - Requests that can acquire tokens are processed immediately.
   - Requests that cannot acquire tokens are enqueued (up to queue capacity).
   - Requests that cannot be enqueued (queue full) are rejected.
3. The count of immediate, queued, and rejected requests is printed.
4. **Queue processing:** Over 5 simulated seconds, the queue is periodically processed as tokens refill. Each iteration processes as many queued requests as available tokens allow.
5. Final statistics show the overall throughput, queue behavior, and rejection rate.

## Key Takeaways

- **Token bucket balances burst handling and rate enforcement** — The token bucket algorithm allows short bursts (up to `max_tokens`) while enforcing a sustainable long-term rate (`refill_rate`), which matches how AI API providers implement rate limits.
- **Queuing prevents request loss during bursts** — Rather than rejecting requests outright when the rate limit is hit, queuing holds them until capacity is available, providing a better user experience (slightly delayed response vs. error).
- **Queue capacity limits protect against memory exhaustion** — The fixed-size queue prevents unbounded memory growth during sustained overload. Requests beyond capacity are rejected, which is preferable to a system crash.
- **Priority support enables differentiated service levels** — The priority field on queued requests enables processing higher-priority requests first, which is essential for multi-tenant systems where premium users should get preferential treatment.
- **Per-user rate limiting is the next production step** — This example implements system-wide rate limiting. Production systems typically need per-user or per-API-key limits to prevent a single user from consuming the entire quota, combined with system-wide limits to protect the overall API budget.
