# Example 1: Streaming LLM Response Handler

## How to Run

```bash
python demo.py
```

**Dependencies:** None — uses only Python standard library (`typing`, `datetime`, `time`, `json`).

## What This Demonstrates

This example implements a streaming response handler that simulates Server-Sent Events (SSE) delivery of LLM-generated tokens one at a time, tracking critical performance metrics including Time to First Token (TTFT), total generation time, and tokens per second throughput. Streaming dramatically improves perceived latency because users see the first token within milliseconds rather than waiting for the entire response to generate. The handler also supports error tracking for stream interruption scenarios, which is essential for building resilient production AI interfaces.

## Code Walkthrough

### Key Class

**`StreamingResponse`** — Manages a streaming response lifecycle with metrics tracking:

**State fields:**
- `tokens` — List of received token strings.
- `ttft` — Time to first token in seconds (set when the first token arrives).
- `total_time` — Total streaming duration in seconds (set when streaming completes).
- `start_time` — Timestamp when streaming began.
- `is_complete` — Boolean flag set when the stream finishes or errors.
- `error` — Error message if the stream fails.

**`on_token(token)`** — Called each time a token is received:
- Records the start time on the first token.
- Sets `ttft` to the elapsed time since start on the first token only.
- Appends the token to the list.

**`on_complete()`** — Called when the stream finishes:
- Calculates `total_time` as the elapsed time since start.
- Sets `is_complete` to `True`.

**`on_error(error)`** — Called if the stream fails:
- Records the error message.
- Sets `is_complete` to `True` (streaming cannot continue after an error).

**`tokens_per_second` (property)** — Calculates generation throughput as `token_count / decode_time`, where decode time is `total_time - ttft`. This excludes the initial wait time and measures only the sustained generation rate.

**`full_text` (property)** — Concatenates all tokens into the complete response string.

**`get_metrics()`** — Returns a dictionary with all metrics: token count, TTFT in milliseconds, total time in milliseconds, tokens per second, completion status, and any error message.

### Key Function

**`simulate_streaming(prompt)`** — Simulates a streaming LLM response:
- Creates a `StreamingResponse` and sets the start time.
- Splits a sample response into word-level tokens.
- For each token, sleeps for 50-110ms (simulating variable server latency) and calls `on_token()`.
- Every 5 tokens, a comment notes that in production the tokens would be sent to the client via SSE.
- Calls `on_complete()` when all tokens are delivered.

### Execution Flow (from `main()`)

1. `simulate_streaming()` is called with a sample prompt.
2. The simulated stream generates tokens with variable latency.
3. All metrics are printed: tokens generated, TTFT, total time, tokens per second, completion status.
4. The full response text is printed.
5. A latency comparison shows the perceived wait time (TTFT) versus the non-streaming wait time (total time), demonstrating the user experience improvement from streaming.

## Key Takeaways

- **TTFT is the most important latency metric for user experience** — Users perceive the system as fast if they see the first token quickly, even if total generation takes several seconds. TTFT of 200-500ms feels responsive; TTFT of 2+ seconds feels sluggish.
- **Streaming reduces perceived latency by the full generation time minus TTFT** — Without streaming, users wait for the complete response. With streaming, they wait only for TTFT and then see content incrementally. The difference can be several seconds for long responses.
- **Tokens per second measures sustained throughput** — This metric is useful for capacity planning and SLA monitoring. A drop in tokens per second indicates backend performance degradation.
- **Error handling is critical for streaming** — Streams can fail partway through (network issues, backend errors). The `on_error()` callback and `is_complete` flag enable the client to detect and handle partial responses gracefully.
- **SSE is the standard transport for streaming** — Server-Sent Events provide a simple, unidirectional, text-based streaming protocol that works over HTTP and is natively supported by browsers. Alternatives include WebSockets (bidirectional, more complex) and HTTP chunked transfer encoding (lower-level).
