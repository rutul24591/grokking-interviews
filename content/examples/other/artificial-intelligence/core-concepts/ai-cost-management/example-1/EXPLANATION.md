# Example 1: Model Router for Cost-Optimized LLM Calls

## How to Run

```bash
python demo.py
```

**Dependencies:** None — uses only Python standard library (`typing`, `dataclasses`, `time`).

## What This Demonstrates

This example implements an intelligent model router that classifies prompt complexity and routes each request to the most cost-appropriate LLM tier — small, medium, or large. If the chosen model lacks confidence in its response, the request is automatically escalated to the next tier. This pattern reduces costs significantly by avoiding expensive model calls for simple tasks while maintaining quality through the escalation mechanism, making it a cornerstone of production AI cost optimization.

## Code Walkthrough

### Key Data Structure

**`ModelConfig`** — Defines an LLM model's properties:
- `name` — Model identifier (e.g., `"llama-3-8b"`)
- `tier` — Cost tier (`"small"`, `"medium"`, `"large"`)
- `input_price_per_m` / `output_price_per_m` — Cost per million tokens
- `max_tokens` — Maximum context window

**`MODELS`** — Three configured tiers:
- **Small** — `llama-3-8b` at $0.05/M tokens (open-source, self-hosted cost). Used for simple classification and extraction.
- **Medium** — `claude-sonnet` at $3.00/M input and $15.00/M output. Used for moderate tasks like summarization and explanation.
- **Large** — `gpt-4o` at $2.50/M input and $10.00/M output. Used for complex analysis and reasoning.

### Key Class

**`ModelRouter`** — Routes requests through model tiers with cost tracking:

**`classify_complexity(prompt)`** — Scores prompt complexity based on:
- Word count: >200 words adds 3 points, >50 words adds 2 points.
- Complex keywords (`analyze`, `compare`, `evaluate`, `synthesize`, `reason`, `architect`, `design`, `optimize`, `debug`, `refactor`): each adds 2 points.
- Moderate keywords (`summarize`, `explain`, `convert`, `extract`, `classify`): each adds 1 point.
- Score >= 4 routes to `"large"`, score >= 2 routes to `"medium"`, otherwise `"small"`.

**`simulate_llm_call(model, prompt)`** — Simulates an LLM call:
- Estimates input tokens from word count and sets output tokens by tier (100 for small, 300 for medium, 500 for large).
- Calculates cost based on tier pricing.
- Assigns confidence by tier (0.7 for small, 0.85 for medium, 0.95 for large).

**`route_request(prompt)`** — The core routing method:
1. Classifies the prompt to determine the initial tier.
2. Starting from the initial tier, calls the model and checks confidence.
3. If confidence >= 0.8 or the model is already the largest tier, returns the result.
4. Otherwise, escalates to the next tier and repeats.
5. Logs each attempt and accumulates total cost.

**`get_cost_report()`** — Produces aggregate statistics: total requests, total cost, average cost per request, and request distribution across tiers.

### Execution Flow (from `main()`)

1. A `ModelRouter` is instantiated.
2. Three prompts of increasing complexity are processed:
   - Simple classification ("positive or negative") — routes to small tier.
   - Summarization request — routes to medium tier.
   - Complex architectural analysis — routes to large tier.
3. For each prompt, the selected model, cost, and confidence are printed.
4. A cost report summarizes total spending and tier distribution.

## Key Takeaways

- **Not every request needs the most powerful model** — Simple classification tasks can be handled by small models at a fraction of the cost, and routing intelligence ensures expensive models are only used when necessary.
- **Confidence-based escalation maintains quality** — The escalation mechanism acts as a safety net: if a cheaper model is not confident, the request automatically moves to a more capable model, preventing quality degradation.
- **Keyword-based classification is a practical starting point** — While more sophisticated classification (using a lightweight model to score complexity) is possible, keyword and length heuristics provide a simple, effective, and zero-cost classification method.
- **Cost savings compound at scale** — Even modest per-request savings multiply dramatically at thousands or millions of requests per day, making model routing one of the highest-ROI cost optimization strategies.
- **Tier configuration should reflect actual pricing** — The model configs should be updated regularly as providers change pricing, and new models (e.g., newer, cheaper alternatives) should be added to the tier list to maintain optimal cost-quality balance.
