# Example 3: Agent Memory Management with Context Compression

## How to Run

```bash
python demo.py
```

**Dependencies:** None beyond the Python 3 standard library. Uses only built-in modules (`typing`, `dataclasses`, `json`).

## What This Demonstrates

This example implements a **three-tier memory system** for AI agents — short-term (active context window), working (scratchpad), and long-term (persisted knowledge) — with **automatic context compression** when the token budget approaches its limit. It demonstrates the critical challenge of managing finite LLM context windows: as an agent accumulates observations and reasoning traces, the system must decide which information to keep in the active window, which to summarize, and which to archive for later retrieval.

## Code Walkthrough

### Key Data Structures

- **`MemoryItem` (dataclass)** — A single unit of memory with four fields:
  - `content` (string) — The actual text (observation, fact, goal, or reasoning).
  - `item_type` (string) — One of `"observation"`, `"fact"`, `"goal"`, or `"reasoning"`, used for categorization and formatting.
  - `importance` (float, 0.0–1.0) — A score that determines whether the item should be preserved in context. Critical facts score high (0.8+), incidental details score low (0.2–0.4).
  - `iteration` (int) — The agent loop iteration when the memory was created.

### Core Class: `MemoryManager`

| Member | Purpose |
|---|---|
| `max_context_tokens` (int) | The LLM's context window capacity (default 100,000). |
| `summarize_threshold` (float) | Fraction of max tokens that triggers compression (default 0.7 = 70%). |
| `importance_threshold` (float) | Minimum importance score to retain in short-term memory (default 0.6). |
| `short_term` (List[MemoryItem]) | Items currently in the active context window. |
| `working` (Dict[str, Any]) | Scratchpad for temporary variables during the current task. |
| `long_term` (List[Dict]) | Archived facts persisted for later retrieval (simulated vector store). |
| `current_tokens` (int) | Running token count of short-term memory. |

### Key Methods

**`add(content, item_type, importance, iteration)`** — Creates a `MemoryItem`, appends it to `short_term`, updates `current_tokens`, and triggers `_compress()` if the token budget exceeds `summarize_threshold`.

**`_compress()`** — The core compression algorithm:
1. **Categorizes items** into three buckets:
   - **Keep** (importance >= 0.8): Critical facts that remain in the active context window unchanged.
   - **Archive** (importance >= `importance_threshold`): Moved to `long_term` storage for future retrieval.
   - **Summarize** (importance < `importance_threshold`): Condensed into a single summary string.
2. **Generates a summary** of low-importance items via `_generate_summary()`, which truncates each observation to 50 characters and joins them. The summary itself becomes a single `MemoryItem` of type `"summary"` with importance 0.5.
3. **Archives** mid-importance items to `long_term` as structured dicts.
4. **Replaces** `short_term` with only the kept items + the new summary, then recalculates `current_tokens`.

**`get_context()`** — Formats all `short_term` items into a readable string for the LLM, prefixing each line with a type tag (`[OBS]`, `[FACT]`, `[GOAL]`, `[THOUGHT]`, `[SUMMARY]`).

**`retrieve_relevant(query, top_k)`** — Simulates a vector-database retrieval from `long_term` using keyword overlap scoring. In production, this would use actual embeddings and cosine similarity.

**`get_status()`** — Returns a monitoring dict with token utilization, item counts, and working-memory keys — useful for agent health dashboards.

### Execution Flow (step-by-step)

1. **`main()`** creates a `MemoryManager` with `max_context_tokens=100,000`.
2. Seven high-value memory items are added (iterations 1–5), simulating an incident investigation:
   - A **goal** (importance 0.95): "Investigate the production latency spike".
   - **Observations** (importance 0.85–0.95): P99 latency spike, 503 errors, Redis node failure.
   - A **fact** (importance 0.8): "Payment-service depends on Redis cache cluster".
   - **Reasoning** steps (importance 0.3–0.4): "Need to check which service is affected".
3. Nine low-importance items (iterations 6–14, importance 0.2) are added to simulate routine investigation details that accumulate context but are individually unimportant.
4. After enough items are added, `_compress()` triggers because `current_tokens` exceeds 70% of `max_context_tokens`.
5. During compression:
   - High-importance items (goal, critical observations, the Redis fact) are **kept** in short-term memory.
   - Mid-importance items (none in this demo, since all non-low items are >= 0.8) would be **archived**.
   - Low-importance items (the nine step-6-through-14 observations) are **summarized** into a single summary string.
6. The script prints:
   - **Memory status**: short-term item count, long-term item count, current tokens, utilization percentage, and working-memory keys.
   - **Current context** (truncated to 500 chars): Shows the compressed short-term memory with type-tagged lines.
   - **Long-term memory**: Archived facts with their type and content preview.
   - **Retrieval results** for the query `"Redis cluster"`: Returns matching items from long-term memory ranked by keyword overlap.

### Important Design Notes

- **Token estimation** (`_estimate_tokens`) uses a simple `word_count * 1.3` heuristic. Production systems use the actual tokenizer (e.g., tiktoken for OpenAI models) for accurate counts.
- **Importance scoring** is a simplification. In real systems, importance is determined by the LLM itself (self-assessment), by heuristics (e.g., goal-related items score higher), or by a separate scoring model.
- **Long-term retrieval** here uses naive keyword overlap. Production agents use embedding models (e.g., OpenAI's `text-embedding-3-small`) with vector databases (Pinecone, Weaviate, pgvector) for semantic similarity search.
- The **three-tier memory model** mirrors cognitive architectures in cognitive science (sensory/working/long-term memory) and is a common pattern in production agent frameworks like AutoGPT, LangGraph, and custom agent runtimes.

## Key Takeaways

- **Context windows are finite** — agents must actively manage what stays in the active context window through compression, summarization, and archival to avoid losing critical information or exceeding token limits.
- The **three-tier memory separation** (short-term, working, long-term) maps to real architectural needs: fast access to recent context, a scratchpad for current-task state, and persistent storage for facts needed across sessions.
- **Importance scoring** is the key mechanism for deciding what to keep, summarize, or archive — items that represent goals, critical facts, or major findings score high; incidental observations score low.
- **Automatic compression** prevents context overflow by summarizing low-value observations into a single condensed entry while preserving high-importance items verbatim.
- **Retrieval from long-term memory** allows the agent to "remember" facts it has archived — in production, this is done via vector similarity search over embeddings, enabling the agent to recall relevant information even when it's no longer in the active context window.
- The working memory (`working` dict) serves as a **task-local scratchpad** — useful for storing intermediate computation results, loop counters, or partial aggregations that don't need to persist beyond the current task.
