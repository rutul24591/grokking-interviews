## How to Run

```bash
python demo.py
```

No external dependencies required — uses only Python standard library (`time`, `random`, `typing`).

## What This Demonstrates

This example implements a production-ready LLM API wrapper that simulates calling an LLM provider with **token tracking**, **cost estimation**, and **exponential backoff retry logic**. It shows how to build a resilient integration layer that tracks per-request token usage (input vs output), calculates costs based on model-specific pricing, and handles transient failures gracefully.

## Code Walkthrough

### Key Classes

**`LLMResponse`** — A data class that encapsulates the response from an LLM API call. It stores three fields:
- `content` (str): The generated text response from the model
- `usage` (Dict[str, int]): A dictionary with three keys — `prompt_tokens` (input token count), `completion_tokens` (output token count), and `total_tokens` (sum of both)
- `model` (str): The model identifier used for the request (e.g., "gpt-4o", "claude-sonnet-3-5")

This mirrors the actual response structure returned by OpenAI's `openai.types.chat.ChatCompletion` and Anthropic's `anthropic.types.Message` APIs.

### Key Functions

**`estimate_cost(usage, model)`** — Calculates the dollar cost of an API call based on token usage and model-specific pricing.

- **`PRICING`** dictionary defines per-model pricing per 1M tokens, with separate rates for input and output tokens (output is typically 3-10x more expensive)
- The function retrieves the pricing tier for the given model, then calculates: `input_cost = (prompt_tokens / 1,000,000) × input_rate` and `output_cost = (completion_tokens / 1,000,000) × output_rate`
- Returns the sum rounded to 6 decimal places for accurate cost tracking
- Returns 0.0 for unknown models (graceful degradation rather than crashing)

**`call_llm_with_retry(prompt, model, max_retries, base_delay)`** — Calls the LLM with exponential backoff retry logic.

- **`attempt`** loop: Iterates up to `max_retries` times (default 3)
- On success: Returns an `LLMResponse` object with simulated token counts
- On failure: Calculates a backoff delay using the formula `delay = base_delay × (2 ^ attempt) + random_jitter`, where jitter (0-1 second random float) prevents thundering herd problems when multiple clients retry simultaneously
- **`base_delay`** defaults to 1.0 second, so retries happen at ~1s, ~2s, ~4s intervals (plus jitter)
- On final failure: Raises the last exception rather than silently returning

**`main()`** — The entry point that demonstrates the full flow:

1. Creates a sample document text (simulating a financial report)
2. Constructs a prompt that includes the document
3. Calls `call_llm_with_retry()` with `model="gpt-4o"` and `max_retries=3`
4. Passes the response's `usage` dictionary to `estimate_cost()`
5. Prints a summary showing model name, token breakdown (prompt vs completion vs total), estimated cost, and response content

## Execution Flow

```
main() → call_llm_with_retry() → [simulate API call] → LLMResponse
                                    ↓
                              estimate_cost() → cost in dollars
                                    ↓
                              print summary
```

## Key Takeaways

- **Token tracking is essential**: Every LLM request should track input vs output tokens separately, as output tokens cost significantly more
- **Cost estimation should be automatic**: Embed pricing lookup in your API wrapper so every request knows its cost without manual calculation
- **Retry with jitter**: Exponential backoff with random jitter prevents synchronized retries that could overwhelm a recovering service
- **Graceful degradation**: Unknown models return $0 cost rather than crashing, allowing the system to continue operating even when pricing data is stale