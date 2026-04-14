# Example 3: Prompt Token Optimizer — Compressing Prompts Without Losing Quality

## How to Run

```bash
python demo.py
```

**Dependencies:** None — uses only Python standard library (`typing`, `dataclasses`).

## What This Demonstrates

This example implements a prompt token optimizer that reduces the token count of prompts by removing redundant whitespace, replacing verbose phrases with compact equivalents, and stripping filler sentences. It then evaluates whether the optimization impacts response quality by comparing quality scores before and after compression. This demonstrates that significant token savings (and therefore cost savings) can be achieved by writing concise prompts without degrading the model's ability to produce good responses.

## Code Walkthrough

### Key Data Structure

**`OptimizationResult`** — Captures the before-and-after comparison:
- `original_tokens` / `optimized_tokens` — Estimated token counts
- `reduction_pct` — Percentage reduction in tokens
- `quality_score_original` / `quality_score_optimized` — Simulated quality scores (0.0 to 1.0)
- `quality_delta` — Change in quality score after optimization (positive means quality improved)

### Key Functions

**`estimate_tokens(text)`** — Roughly estimates token count using the heuristic of 1.3 tokens per word. This approximates typical LLM tokenization where tokens average ~0.75 words.

**`optimize_prompt(prompt)`** — Applies three optimization passes:
1. **Whitespace cleanup:** Replaces all double (or more) spaces with single spaces and strips leading/trailing whitespace.
2. **Phrase replacement:** Substitutes verbose phrases with compact equivalents. For example, `"Please provide a detailed analysis of"` becomes `"Analyze:"`, and `"I would like you to help me understand"` becomes `"Explain:"`. Eight replacement pairs are defined.
3. **Filler removal:** Removes four common filler sentences (`"I hope this!"`, `"Let me know if you need anything else."`, etc.) that add tokens but no instructional value.

**`simulate_quality_score(prompt)`** — Simulates a quality score based on prompt characteristics:
- Base score of 0.7.
- +0.15 if the prompt starts with a clear instruction (`"Analyze:"`, `"Explain:"`, `"Evaluate:"`, `"Compare:"`).
- +0.10 if the prompt mentions format or structure requirements.
- -0.05 if the prompt exceeds 100 words (excessive verbosity can hurt clarity).
- Capped at 1.0.

**`optimize_and_evaluate(prompt)`** — Orchestrates the full optimization pipeline: estimates original tokens, optimizes the prompt, estimates optimized tokens, simulates quality scores for both versions, and returns an `OptimizationResult`.

### Execution Flow (from `main()`)

1. Three prompts are analyzed:
   - **Prompt 1** — A verbose 66-word prompt with multiple filler phrases, redundant phrases, and filler sentences. This represents a typical poorly-written prompt.
   - **Prompt 2** — A concise 15-word prompt that already uses compact instruction format. This represents an already-optimized prompt.
   - **Prompt 3** — A 51-word prompt with self-referential language ("As a helpful AI assistant"), verbose phrasing, and filler sentences.
2. For each prompt, `optimize_and_evaluate()` is called and the results are printed, showing original token count, optimized token count, reduction percentage, and quality score change.

## Key Takeaways

- **Verbose prompts waste tokens and money** — Phrases like "Please provide a detailed analysis of" and "I would like you to help me understand" add tokens without adding instructional value. Direct instructions like "Analyze:" and "Explain:" are more effective and cheaper.
- **Token reduction does not mean quality reduction** — In many cases, optimization actually improves quality scores because concise prompts are clearer and more specific. The quality delta in the results often shows zero or positive change.
- **Filler sentences are pure waste** — Sentences like "I hope this helps!" and "Let me know if you need anything else" are conversational politeness that add tokens but contribute nothing to the model's understanding of the task.
- **Instruction format matters** — Prompts that start with clear, direct instructions (`"Analyze:"`, `"Explain:"`) score higher on quality because the model immediately understands what is expected.
- **Token savings compound at scale** — A 50-70% token reduction per prompt, multiplied by thousands of requests per day, translates directly into proportional cost savings on API bills, making prompt optimization one of the simplest and most effective cost reduction strategies.
