# Example 3: Token Count Validator — Context Window Management

## How to Run

```bash
python demo.py
```

Requires the `tiktoken` library. If not installed, run: `pip install tiktoken`.

## What This Demonstrates

This example implements a `TokenBudget` class that manages token allocation for LLM requests by accurately counting tokens across all prompt components (system prompt, context, few-shot examples, and user input) before sending a request. It enforces context window limits by automatically truncating oversized context sections and provides a detailed token budget report showing utilization percentages, enabling production-safe prompt construction that avoids exceeding model limits.

## Code Walkthrough

### Class: `TokenBudget`

The core class that encapsulates all token budgeting logic.

#### Constructor: `__init__(self, context_window: int, model: str = "gpt-4o")`

Initializes the budget manager with:
- `context_window`: The maximum token limit for the model (default 128,000 for GPT-4o).
- `model`: The target model name, used to select the correct tokenizer.
- `self.enc`: The tokenizer obtained via `tiktoken.encoding_for_model("gpt-4o")`, which returns the exact tokenizer used by GPT-4o.

#### Method: `count_tokens(self, text: str) -> int`

A utility method that encodes the input text using the model's tokenizer and returns the token count. This is the atomic operation used throughout the budgeting logic.

#### Method: `build_prompt(...)`

The primary method that constructs a prompt while enforcing token budgets. Parameters:

| Parameter | Type | Purpose |
|---|---|---|
| `system_prompt` | `str` | The system-level instruction |
| `context` | `str` | Retrieved context/document content (e.g., RAG results) |
| `user_input` | `str` | The user's query or instruction |
| `max_output_tokens` | `int` | Reserved tokens for the model's response (default 1,000) |
| `few_shot_examples` | `list[str] \| None` | Optional list of few-shot example strings |

**Execution flow:**

1. **Calculate available budget** — Subtracts `max_output_tokens` from `context_window` to determine how many tokens are available for the input prompt.
2. **Count fixed components** — Tokenizes `system_prompt` and `user_input` individually.
3. **Count few-shot examples** — If provided, iterates over each example and accumulates their token counts.
4. **Calculate remaining context budget** — Subtracts fixed tokens and example tokens from available tokens. If the result is negative, raises a `ValueError` because the fixed components alone exceed the input budget.
5. **Truncate context if needed** — Counts the context tokens. If they exceed the remaining budget, the method encodes the context, slices the token list to fit the budget (`context_encoded[:context_tokens_available]`), and decodes it back to text. This ensures the context fits within the allocated space.
6. **Assemble final prompt** — Wraps each component in XML-like tags (`<system>`, `<examples>`, `<context>`, `<user>`) and joins them with double newlines.
7. **Return result** — Returns a dictionary containing the final prompt string and a `token_breakdown` dict with per-component token counts, total input tokens, total (input + output), context window size, and utilization percentage.

### Function: `main()`

Demonstrates usage by:
1. Creating a `TokenBudget` with a 128,000 token context window (GPT-4o).
2. Defining a system prompt for legal document analysis, a simulated long context (repeated string × 500), a user input asking about termination clauses, and two few-shot examples.
3. Calling `build_prompt()` with `max_output_tokens=2000`.
4. Printing the token breakdown report, or catching and printing any `ValueError` if the budget is exceeded.

## Key Takeaways

- **Always count tokens before sending requests**: Guessing token counts leads to unexpected `400 Bad Request` errors from the API when prompts exceed context windows. Use the model's exact tokenizer for accurate counts.
- **Budget partitioning is critical**: Reserve tokens explicitly for output (`max_output_tokens`) first, then allocate the remainder among system prompt, context, few-shot examples, and user input. This prevents the model from having insufficient space to generate a response.
- **Truncation should be application-controlled**: When context exceeds the budget, the application should truncate intelligently (e.g., dropping least-relevant document sections) rather than letting the API fail or silently dropping content. This example uses a simple token-level truncation; production systems should use semantic chunking.
- **Utilization monitoring matters**: The `utilization` percentage in the breakdown helps you understand how much of the context window each request consumes, enabling capacity planning and cost optimization across your application's request patterns.
- **Few-shot examples have a hidden cost**: Each example consumes tokens from the same limited budget. While they improve output quality, they reduce the space available for context — a trade-off that must be measured and tuned per use case.
