# Continuous Batching Simulator

## How to Run

```bash
python demo.py
```

No external dependencies required. Uses only Python standard library (`random`, `time`, `dataclasses`, `typing`).

## What This Demonstrates

This example simulates and compares two approaches to processing LLM requests: single-request processing (one at a time) versus continuous batching (overlapping prefill and decode phases for multiple requests). It quantifies the throughput improvement and latency reduction achieved by continuous batching.

## Code Walkthrough

### Key Classes

- **`Request`** (dataclass): Represents an incoming request with `id`, `arrival_time`, `prompt_tokens` (input length), `output_tokens` (generated length), and `completed_at` timestamp.

### Key Functions

- **`simulate_single_request()`**: Processes requests sequentially. Each request must fully complete (prefill + decode) before the next begins. Total latency is the sum of all processing times.
- **`simulate_continuous_batching()`**: Simulates continuous batching where multiple requests are processed together. The prefill phase benefits from parallel processing (using `prefill_multiplier = 0.5` for 2x speedup), and the decode phase processes tokens sequentially but batches across requests.

### Execution Flow

1. **`main()`** generates 20 requests arriving every 100ms with variable prompt lengths (500-2000 tokens) and output lengths (50-500 tokens).
2. Runs single-request simulation: each request is processed start-to-finish before the next begins.
3. Runs continuous batching simulation with batch_size=4: prefill is 2x faster due to parallel token processing, and requests can overlap.
4. Compares throughput (requests/second) and average latency between the two approaches.
5. Prints throughput improvement factor and latency reduction percentage.

### Important Variables

- `token_latency_ms = 50`: Simulated milliseconds per token generation.
- `prefill_multiplier = 0.5`: Prefill is 2x faster in batching mode due to parallel processing of prompt tokens.
- `max_batch_size = 4`: Maximum number of requests processed together in a batch.

## Key Takeaways

- Continuous batching significantly improves GPU utilization by overlapping the compute-heavy prefill phase with the memory-bound decode phase across multiple requests.
- Single-request processing leaves GPU idle during network I/O and between requests, wasting expensive GPU compute resources.
- The throughput improvement from continuous batching is typically 2-4x in production systems, making it essential for cost-effective LLM serving.
- Batch size is a tunable parameter: larger batches increase throughput but also increase tail latency for individual requests.
- Production systems like vLLM implement continuous batching at the token level (iteration-level scheduling), allowing requests to enter and exit the batch dynamically.
