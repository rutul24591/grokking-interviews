# Example 2: Multilingual Token Efficiency Comparison

## How to Run

```bash
python demo.py
```

Requires the `tiktoken` library. If not installed, run: `pip install tiktoken`.

## What This Demonstrates

This example shows how the same semantic message, when translated into different languages, produces significantly different token counts when processed by OpenAI's `cl100k_base` tokenizer (used by GPT-4). It reveals that languages with non-Latin scripts (Chinese, Hindi, Arabic, Japanese) and even some Latin-script languages (Finnish) can cost 2–5x more tokens than English for identical meaning, directly impacting API costs, context window consumption, and rate limiting.

## Code Walkthrough

### Data: `SAMPLES` Dictionary

A dictionary mapping seven language names to their respective translations of the same business sentence: *"The quarterly earnings report shows revenue growth of 15% year-over-year, with operating margins expanding to 28%."* The languages covered are English, Chinese, Arabic, Hindi, Japanese, Spanish, and Finnish.

### Function: `analyze_token_efficiency()`

This is the entry point called by `if __name__ == "__main__"`. The execution flow is:

1. **Load tokenizer** — Retrieves the `cl100k_base` encoding via `tiktoken.get_encoding()`, which is the tokenizer used by GPT-4 models.
2. **Print header** — Outputs a formatted table with columns: Language, Characters, Tokens, Tokens/Character, and Relative Cost.
3. **Iterate over languages** — For each language-text pair:
   - Encodes the text into tokens using `enc.encode(text)`.
   - Calculates `token_count` (length of the token list), `char_count` (string length), and `tokens_per_char` ratio.
   - For English, stores `token_count` as the baseline (`english_tokens`).
   - Computes `relative_cost` as the ratio of the current language's token count to English's token count.
   - Prints one row in the formatted table.
4. **Print key insight** — After the table, outputs a summary noting that non-English languages can cost 2–5x more due to tokenization inefficiency, affecting API costs, context window usage, and rate limits.

### Key Variables

| Variable | Type | Purpose |
|---|---|---|
| `SAMPLES` | `dict[str, str]` | Maps language names to equivalent translated sentences |
| `enc` | `tiktoken.Encoding` | The `cl100k_base` tokenizer instance |
| `english_tokens` | `int` | Baseline token count from the English text |
| `relative_cost` | `float` | Ratio of current language tokens to English tokens |

## Key Takeaways

- **Tokenization is language-biased**: The `cl100k_base` tokenizer was primarily trained on English text, so languages with different scripts (CJK, Devanagari, Arabic) require more tokens per character to represent the same meaning.
- **Cost impact is multiplicative**: A message that costs 3x tokens in one language directly triples the API cost for that request, multiplies context window consumption by 3, and accelerates rate limit exhaustion.
- **Character count is misleading**: A shorter-looking string in Chinese may actually consume more tokens than a longer English sentence — always measure tokens, not characters, when budgeting.
- **Architecture implications**: Multilingual applications should implement language-aware token counting, potentially using language-specific prompts or summarization to reduce input size for non-English languages.
- **Benchmarking is essential**: Run token efficiency analysis on your actual use-case texts across target languages before committing to a model, as different tokenizers (e.g., `o200k_base` for GPT-4o) have varying cross-language performance.
