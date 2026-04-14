# Example 1: Fine-Tuning Decision Framework

## How to Run

```bash
python demo.py
```

**Dependencies:** None — uses only Python standard library (`typing`, `dataclasses`).

## What This Demonstrates

This example implements a decision framework that evaluates whether a given task is better served by Retrieval-Augmented Generation (RAG), fine-tuning, or a hybrid of both. It scores task characteristics against known strengths of each approach — RAG excels at fresh knowledge, source attribution, and access control, while fine-tuning excels at behavior adaptation and high-volume efficiency. The framework produces a scored recommendation with reasoning, helping engineering teams make informed architecture decisions.

## Code Walkthrough

### Key Data Structure

**`TaskProfile`** — Represents a task with eight integer/boolean characteristics scored on a 1-5 scale (unless boolean):
- `knowledge_freshness` (1-5) — How frequently the required knowledge changes (1 = stable, 5 = changes daily)
- `needs_source_attribution` (bool) — Whether the system must cite sources for its answers
- `needs_access_control` (bool) — Whether different users should see different knowledge subsets
- `knowledge_volume` (1-5) — How much reference knowledge is required (1 = small, 5 = massive)
- `needs_behavior_adaptation` (bool) — Whether the model must adopt a specific format, tone, or reasoning style
- `per_request_volume` (1-5) — Expected request volume (1 = low, 5 = very high)
- `budget_upfront` (1-5) — Available upfront budget (1 = low, 5 = high)

### Key Function

**`evaluate_task(profile)`** — Computes separate RAG and fine-tuning scores and returns a recommendation:

**RAG scoring:**
- Knowledge freshness contributes `freshness * 4` points (RAG can update its knowledge base without retraining)
- Source attribution adds 15 points (RAG retrieves from identifiable documents)
- Access control adds 15 points (RAG can filter retrieved documents per user)
- Knowledge volume contributes `volume * 3` points (RAG scales knowledge via vector database, not model parameters)

**Fine-tuning scoring:**
- Behavior adaptation adds 20 points (fine-tuning directly modifies model behavior)
- Per-request volume contributes `volume * 3` points (fine-tuning reduces per-request token cost)
- Upfront budget >= 3 adds 10 points (fine-tuning requires training compute budget)

**Recommendation logic:**
- If RAG score exceeds fine-tuning score by more than 10: recommend `"RAG"`
- If fine-tuning score exceeds RAG score by more than 10: recommend `"Fine-Tuning"`
- Otherwise: recommend `"Hybrid"` (both behavior adaptation and fresh knowledge are needed)

### Execution Flow (from `main()`)

Three tasks are evaluated:

1. **Customer support chatbot** — Fresh knowledge (3), needs attribution and access control, large knowledge volume, needs behavior adaptation, very high request volume, moderate budget. The framework scores RAG and fine-tuning and produces a recommendation.

2. **Legal document analysis** — Stable knowledge (2), needs attribution and access control, massive knowledge volume, no behavior adaptation needed, low request volume, low budget. RAG is strongly favored due to attribution, access control, and knowledge volume requirements.

3. **Code style compliance** — Stable knowledge (1), no attribution or access control needed, small knowledge volume, needs behavior adaptation, very high request volume, high budget. Fine-tuning is strongly favored due to behavior adaptation and high volume needs.

## Key Takeaways

- **RAG and fine-tuning solve fundamentally different problems** — RAG addresses knowledge gaps (what the model knows), while fine-tuning addresses behavior gaps (how the model responds). Understanding this distinction is the foundation of any architecture decision.
- **Knowledge freshness strongly favors RAG** — If knowledge changes frequently, fine-tuning would require constant retraining, making RAG the only practical choice.
- **Source attribution and access control are RAG-exclusive strengths** — Only RAG can cite specific retrieved documents and filter knowledge per user, since the knowledge exists as separate retrievable records.
- **Behavior adaptation is fine-tuning's primary advantage** — When the model must follow a specific format, tone, or reasoning pattern, fine-tuning directly encodes this into the model weights.
- **Hybrid approaches are common in production** — Many real-world systems need both updated knowledge (RAG) and adapted behavior (fine-tuning), making the hybrid recommendation the most realistic for complex applications.
