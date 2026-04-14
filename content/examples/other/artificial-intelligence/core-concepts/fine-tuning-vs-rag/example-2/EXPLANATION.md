# Example 2: Cost Crossover Analysis — Fine-Tuning vs RAG

## How to Run

```bash
python demo.py
```

**Dependencies:** None — uses only Python standard library. No external packages required.

## What This Demonstrates

This example calculates the total cost of ownership for RAG versus fine-tuning over a 180-day period across three request volume scenarios (1K, 10K, and 100K requests per day). It finds the crossover point — the day at which fine-tuning becomes cheaper than RAG — by factoring in API costs (which differ due to token count differences), infrastructure costs (vector database and embeddings for RAG, GPU serving for fine-tuning), and upfront training costs for fine-tuning. This analysis is essential for making economically informed architecture decisions.

## Code Walkthrough

### Key Function

**`calculate_costs()`** — Computes cumulative daily costs for both approaches over a specified number of days:

**RAG cost model per day:**
- API costs based on `daily_requests * rag_input_tokens` (typically ~3000 tokens for context + prompt) and `daily_requests * rag_output_tokens` (~500 tokens).
- Daily vector database cost (`vector_db_monthly / 30`, default ~$3.33/day).
- Daily embedding cost (`embedding_monthly / 30`, default ~$1.67/day).
- These infrastructure costs are constant regardless of request volume, making RAG more expensive at low volumes.

**Fine-tuning cost model per day:**
- Upfront training cost ($500) added on day 1.
- API costs based on `daily_requests * ft_input_tokens` (typically ~500 tokens, since the knowledge is baked into the model) and `daily_requests * ft_output_tokens` (~500 tokens).
- Daily GPU serving cost (`gpu_serving_monthly / 30`, default ~$6.67/day).
- Fine-tuning has lower per-request API costs because it does not need to include retrieved context in each prompt.

**Crossover detection:**
- Iterates through daily cumulative costs and identifies the first day where RAG's cumulative cost exceeds fine-tuning's cumulative cost.
- If no crossover occurs within the analysis period, reports which approach is cheaper throughout.

### Execution Flow (from `main()`)

Three volume scenarios are analyzed over 180 days:

1. **Low volume (1K/day)** — At this volume, the fixed infrastructure costs of RAG (vector DB + embeddings) and the fine-tuning training cost are both modest. The per-request API cost difference is small in absolute terms. The analysis shows which approach wins and whether a crossover occurs.

2. **Medium volume (10K/day)** — The per-request cost difference becomes significant at this scale. RAG's higher token counts per request accumulate rapidly, while fine-tuning's upfront training cost is amortized over many requests. A crossover point is likely to appear.

3. **High volume (100K/day)** — At this scale, the per-request cost difference dominates all other factors. Fine-tuning's lower token counts per request make it significantly cheaper after the initial training cost is amortized, and the crossover occurs early.

For each scenario, the output shows the 6-month cumulative cost for both approaches and the crossover day (if any).

## Key Takeaways

- **Fine-tuning has higher upfront costs but lower per-request costs** — The training cost and GPU serving are fixed, but each request uses fewer tokens because knowledge is encoded in the model rather than retrieved as context.
- **RAG has lower upfront costs but higher per-request costs** — No training is needed, but every request must include retrieved context (adding ~2000-3000 input tokens) plus vector database and embedding infrastructure.
- **Crossover point depends on volume** — Higher request volumes amortize the upfront training cost faster and magnify the per-request savings, moving the crossover point earlier.
- **Infrastructure costs matter** — The vector database and embedding costs for RAG, and GPU serving costs for fine-tuning, are often overlooked but contribute significantly to total cost of ownership.
- **Volume projections should be conservative** — If actual traffic falls below projections, a fine-tuning investment may never reach its crossover point; if traffic exceeds projections, RAG costs can escalate faster than expected.
