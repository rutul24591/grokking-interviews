# Example 3: Model Router — Intelligent Model Selection Based on Task Complexity

## How to Run

```bash
python demo.py
```

**Dependencies:** No external packages required. This example uses only Python's built-in `json` module, the `Enum` class from `enum`, and standard library type hints (`Dict`, `Any`, `Optional`, `List` from `typing`). Run with Python 3.7+.

---

## What This Demonstrates

This example implements a model routing system that intelligently selects between small, medium, and large language model tiers based on the complexity of the incoming task, optimizing for both cost and output quality. It showcases a production-grade pattern where simpler (cheaper, faster) models handle easy tasks while more capable (expensive, slower) models are reserved for complex reasoning, with automatic escalation when a model's confidence falls below a configurable threshold — a strategy increasingly adopted by enterprises to manage LLM inference costs at scale.

---

## Code Walkthrough

### Key Classes and Their Responsibilities

#### `ModelTier` (Enum)

Defines three model tiers that represent the trade-off spectrum between capability and cost:
- **SMALL** — Fast and inexpensive, suitable for simple tasks like counting, listing, or basic extraction.
- **MEDIUM** — Balanced cost and capability, appropriate for summarization, explanation, translation, and formatting tasks.
- **LARGE** — Most capable and most expensive, reserved for tasks requiring deep reasoning, architecture design, debugging, or multi-step analysis.

This enum serves as the routing key throughout the system, ensuring type-safe tier selection.

#### `ModelConfig`

A configuration data class that holds metadata for a specific model:
- `name` — The model identifier (e.g., `"llama-3-8b"`, `"claude-sonnet"`, `"gpt-4o"`).
- `tier` — The `ModelTier` this model belongs to.
- `cost_per_1m_input` / `cost_per_1m_output` — Pricing per million input and output tokens, used for cost calculation.

Instances of this class are stored in the `MODEL_REGISTRY` dictionary, keyed by `ModelTier`, providing a central lookup for model metadata.

#### `TaskClassifier`

A rule-based classifier that maps a prompt string to a `ModelTier`. It uses two heuristics:
1. **Keyword matching:** Scans the prompt for complexity-indicating keywords grouped into high, medium, and low categories. Each match increments the corresponding tier's score.
2. **Prompt length:** Longer prompts (> 200 words) receive a bonus to the high-complexity score, as they typically indicate multi-faceted tasks. Medium-length prompts (50–200 words) add a smaller bonus to the medium score.

The `classify` classmethod returns the appropriate `ModelTier` based on these scores. In production, this could be replaced by a trained classifier or even a lightweight LLM call, but the keyword-based approach provides a transparent, deterministic baseline.

#### `ModelRouter`

The core orchestrator class that manages the full request lifecycle:
- Maintains a running `total_cost` accumulator and a `request_log` list for auditing.
- The `route_request` method classifies the task, determines which tiers to try (starting from the classified tier and escalating upward), and iterates through them.
- For each tier, it simulates an LLM call via `_simulate_llm_call`, checks the returned confidence score against `escalate_threshold`, and either accepts the result or escalates to the next tier.
- The `get_cost_report` method aggregates statistics across all routed requests, including total cost, per-request average, and a breakdown by tier.

### Important Functions and Their Role

#### `TaskClassifier.classify(prompt) -> ModelTier`

This is the decision engine. It lowercases the prompt, counts keyword matches across the three complexity buckets, applies a length-based adjustment, and then applies a decision tree:
- If `high_score >= 2` or `high_score > medium_score`, classify as LARGE.
- Else if `medium_score >= 2`, classify as MEDIUM.
- Otherwise, classify as SMALL.

This logic ensures that tasks with multiple high-complexity signals are routed to the most capable model, while ambiguous cases escalate conservatively.

#### `ModelRouter._simulate_llm_call(prompt, model) -> Dict[str, Any]`

A stand-in for a real LLM API call. It computes:
- **Input tokens:** Approximated as word count of the prompt.
- **Output tokens:** A fixed value based on tier (100 for SMALL, 200 for MEDIUM, 300 for LARGE).
- **Cost:** Calculated from input/output token counts and the model's per-million-token pricing.
- **Confidence:** A tier-dependent score (0.7 for SMALL, 0.85 for MEDIUM, 0.95 for LARGE) representing the model's self-assessed reliability.

In a production system, this would be replaced by actual API calls to OpenAI, Anthropic, or self-hosted models.

#### `ModelRouter.route_request(prompt, escalate_threshold=0.6) -> Dict[str, Any]`

The main routing function. Its flow:
1. Classify the prompt using `TaskClassifier.classify`.
2. Build a list of tiers to try, starting from the classified tier and including all higher tiers for escalation.
3. Loop through tiers, calling `_simulate_llm_call` for each.
4. If the returned confidence is below `escalate_threshold` and a higher tier is available, print an escalation message and continue to the next tier.
5. If confidence is acceptable or no higher tier exists, break and return the result.
6. Log the request and accumulate cost.
7. Catches exceptions and falls through to the next tier (fallback handling).

#### `ModelRouter.get_cost_report() -> Dict[str, Any]`

Aggregates the `request_log` into a summary containing total cost, number of requests, average cost per request, and a count of requests per tier. Useful for monitoring and optimization.

### Critical Variables and Data Structures

| Variable | Type | Description |
|---|---|---|
| `MODEL_REGISTRY` | `Dict[ModelTier, ModelConfig]` | Central registry mapping each tier to its model configuration. |
| `COMPLEXITY_KEYWORDS` | `Dict[str, List[str]]` | Keyword lists grouped by complexity level (high, medium, low). |
| `total_cost` | `float` | Running accumulator of all incurred costs across routed requests. |
| `request_log` | `List[Dict[str, Any]]` | Audit trail storing per-request metadata (model used, tier, cost, confidence). |
| `tiers_to_try` | `List[ModelTier]` | Ordered list of tiers to attempt for a given request, built dynamically based on classification and escalation rules. |
| `escalate_threshold` | `float` | Confidence cutoff below which the router escalates to a more capable model. Default is 0.6. |

### Execution Flow

1. **Entry point:** `if __name__ == "__main__"` calls `main()`.
2. **Router instantiation:** A `ModelRouter` object is created, initializing `total_cost` to 0.0 and `request_log` to an empty list.
3. **Prompt iteration:** The function loops over five test prompts of increasing complexity:
   - **Prompt 1** (word count): Contains low-complexity keywords ("count"). Classified as SMALL. Executed on SMALL model. Confidence 0.7 exceeds threshold. Accepted.
   - **Prompt 2** (summarize): Contains medium-complexity keywords ("summarize"). Classified as MEDIUM. Executed on MEDIUM model. Confidence 0.85 exceeds threshold. Accepted.
   - **Prompt 3** (architecture analysis): Contains multiple high-complexity keywords ("analyze", "trade-offs", "reasoning"). Classified as LARGE. Executed on LARGE model. Confidence 0.95 exceeds threshold. Accepted.
   - **Prompt 4** (extraction): Contains medium-complexity keywords ("extract"). Classified as MEDIUM. Executed on MEDIUM model. Accepted.
   - **Prompt 5** (debugging): Contains high-complexity keywords ("debug"). Classified as LARGE. Executed on LARGE model. Accepted.
4. **Cost report:** After all prompts are processed, `get_cost_report()` is called and the result is pretty-printed as JSON, showing total cost, request count, per-request average, and tier distribution.
5. **Output:** All results are printed to stdout, with escalation messages appearing if any model's confidence falls below the threshold.

---

## Key Takeaways

- **Model routing is a cost optimization lever:** By directing simple tasks to cheaper models and reserving expensive models for complex reasoning, organizations can reduce LLM inference costs by 50–80% compared to always using the largest model.
- **Confidence-based escalation provides a safety net:** When a smaller model's self-assessed confidence is low, the router automatically escalates to a more capable tier, balancing cost savings with output quality guarantees.
- **The classification layer is pluggable:** This example uses keyword-based heuristics, but in production you could substitute a fine-tuned classifier, an embedding-similarity lookup against known task templates, or even a fast LLM call — the router's interface remains unchanged.
- **Fallback handling is built in:** The try/except loop over tiers ensures that if a model API fails (rate limit, timeout, outage), the request automatically falls through to the next available tier, improving system resilience.
- **Cost tracking is first-class:** The router maintains a running cost ledger and can generate tier-by-tier reports, enabling engineers to monitor spend, identify optimization opportunities, and make data-driven decisions about which models to use.
- **Tier ordering matters:** The escalation path always moves upward (SMALL → MEDIUM → LARGE), never downward. This monotonic progression ensures that we never degrade quality after having committed compute to a higher tier.
