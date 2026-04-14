# Example 1: Context Window Budget Manager

## How to Run

```bash
python demo.py
```

**Dependencies:** None. Pure Python with only built-in functions (`dataclasses`, `typing`). No external packages required.

## What This Demonstrates

This example implements a **context window budget manager** that tracks token allocation across different context components (system prompt, conversation history, retrieved documents, user query) and performs priority-based truncation when the total exceeds the available budget. It demonstrates how production LLM applications manage finite context windows — ensuring critical content (system prompt, user query) is never truncated while intelligently reducing lower-priority content (retrieved docs, older conversation turns) to fit within the model's token limit.

## Code Walkthrough

### Key Classes and Data Structures

- **`ContextComponent`** (dataclass): Represents a single piece of context with:
  - `name` — identifier for the component (e.g., "system_prompt", "retrieved_docs").
  - `content` — the actual text content.
  - `priority` — an integer from 1-10 where higher means more important and less likely to be truncated. Priority 9-10 components are never truncated.
  - `token_count` — approximate token count, computed in `__post_init__` as `word_count * 1.3` (a rough approximation since actual tokenization depends on the model's tokenizer).
- **`ContextWindowManager`**: Manages token allocation within a fixed budget:
  - `__init__()` — takes `max_tokens` (the model's context window size) and `reserved_for_output` (tokens reserved for the model's response), computing `available = max_tokens - reserved_for_output`.
  - `add()` — adds a context component with a given priority.
  - `optimize()` — the core truncation algorithm:
    1. Calculates total tokens across all components.
    2. If within budget, returns `within_budget` status with no truncations.
    3. If over budget, sorts components by priority (lowest first).
    4. Iterates through low-priority components and truncates up to 70% of each component's tokens (keeping at least 30%), stopping when the total fits within budget.
    5. Skips any component with priority >= 9 (never truncated).
    6. Returns optimization status with a list of truncations applied.
  - `get_context()` — concatenates all component content into the final context string.

### Execution Flow (Step-by-Step)

1. **Initialize manager**: Created with a 128K token context window and 4K tokens reserved for output, leaving 124K tokens for context.
2. **Add components with priorities**:
   - `system_prompt` (priority 10): Core instructions — never truncated.
   - `conversation_turn_1` (priority 5): Earlier conversation — low priority, truncatable.
   - `conversation_turn_2` (priority 5): Earlier conversation — low priority, truncatable.
   - `conversation_turn_3` (priority 7): More recent conversation — medium priority.
   - `retrieved_docs` (priority 6): Retrieved reference material — medium priority, but very large (500 repetitions of a sentence).
   - `user_query` (priority 10): Current user question — never truncated.
3. **Optimize**: `optimize()` calculates total tokens. Since retrieved_docs is very large, the total exceeds the budget. The optimizer truncates the lowest-priority components first (conversation turns at priority 5, then retrieved_docs at priority 6), keeping high-priority components intact.
4. **Print results**: Shows budget details, optimization status, total used tokens, and a list of truncations with original and truncated token counts plus reduction percentages.

### Important Variables

- `max_tokens = 128000`: The model's total context window (matching Claude's or GPT-4's context size).
- `reserved_for_output = 4000`: Tokens set aside for the model's response. This ensures the model has space to generate a complete answer.
- `priority >= 9`: The threshold for "never truncate" — system prompts and user queries at priority 10 are always preserved.
- `truncate_amount = min(excess, component.token_count * 0.7)`: Limits truncation to at most 70% of a component, ensuring at least 30% of each truncated component survives.

## Key Takeaways

- **Priority-based truncation is essential**: Not all context is equally important. The system prompt and user query must always be preserved, while retrieved documents and old conversation turns can be reduced or removed to fit the budget.
- **Reserved output tokens prevent truncation of responses**: By reserving tokens for the model's response upfront, the manager ensures the model is never forced to produce an incomplete answer due to context window exhaustion.
- **Approximate token counting**: The `word_count * 1.3` approximation is a simple heuristic — production systems use the actual tokenizer to count tokens precisely, but this approach works well for budget estimation.
- **Configurable truncation aggressiveness**: The 70% maximum truncation per component ensures that even low-priority content is partially preserved, preventing complete loss of potentially useful information.
- **Context window is a shared resource**: Multiple components compete for a fixed budget, and the manager's optimization algorithm ensures the most valuable content survives — this is the core challenge in building production LLM applications with finite context windows.
