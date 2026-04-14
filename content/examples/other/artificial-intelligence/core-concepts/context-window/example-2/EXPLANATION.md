# Example 2: Conversation History Summarization

## How to Run

```bash
python demo.py
```

**Dependencies:** None. Pure Python with only built-in functions (`dataclasses`, `typing`). No external packages required.

## What This Demonstrates

This example implements a **conversation history summarization system** that progressively compresses old conversation turns to stay within the context window budget while preserving key facts. As a conversation grows, older turns are summarized into compact factual statements, and only the most recent turns are kept in full detail. This pattern is essential for long-running chat applications and coding assistants where conversations can exceed the model's context window but the model still needs access to earlier context.

## Code Walkthrough

### Key Classes and Data Structures

- **`ConversationTurn`** (dataclass): Represents a single turn in the conversation with:
  - `role` — either "user" or "assistant".
  - `content` — the text of the turn.
  - `token_count` — computed as `word_count * 1.3` in `__post_init__`.
- **`summarize_turns()`**: A simulated summarization function that extracts key facts from a series of conversation turns. It scans each turn's content for keywords (oauth, pkce, token, refresh, code, error, bug) and produces a compact summary like "Discussed OAuth 2.0 implementation; Covered PKCE extension for public clients; Provided code examples." In production, this would be an actual LLM call to generate a natural-language summary.
- **`ConversationManager`**: Manages conversation history with progressive summarization:
  - `__init__()` — takes `max_history_tokens` (the budget for recent conversation history) and `recent_turns_kept` (the minimum number of recent turns to always keep in full).
  - `add_turn()` — adds a new turn and triggers compression if needed.
  - `_compress_if_needed()` — the core compression algorithm:
    1. Calculates total tokens across all turns.
    2. If over budget and more than `recent_turns_kept` turns exist, identifies old turns (all except the most recent N).
    3. Summarizes old turns using `summarize_turns()`.
    4. If a previous summary exists, combines them ("Earlier: ... More recently: ...").
    5. Replaces old turns with the summary, keeping only recent turns in full.
  - `get_context()` — returns the full context string: summary (if any) followed by recent turns.
  - `get_stats()` — returns token statistics including recent turns count, recent tokens, summary tokens, total tokens, budget, and utilization percentage.

### Execution Flow (Step-by-Step)

1. **Initialize manager**: Created with a 500-token history budget and keeping the 2 most recent turns in full. The small budget forces early compression to demonstrate the mechanism.
2. **Add conversation pairs**: Ten user-assistant pairs about OAuth/PKCE implementation are added one at a time:
   - **Turns 1-2**: OAuth basics — under budget, no compression.
   - **Turns 3-4**: PKCE vs implicit grant — still under budget.
   - **Turns 5-6**: Code example — exceeds budget, triggers first compression. Turns 1-4 are summarized into "Previous discussion: Discussed OAuth 2.0 implementation; Covered PKCE extension for public clients; Provided code examples."
   - **Turns 7-8**: Token refresh — may trigger further compression, combining earlier summary with new summary.
   - **Turns 9-10**: Error handling — final state with accumulated summary and only the 2 most recent turns in full.
3. **Print progress**: After each turn, shows the turn content (truncated), current token stats, and summary (if active).
4. **Print final stats**: Shows the final state — number of recent turns, token counts for recent content and summary, total tokens, budget, and utilization percentage.

### Important Variables

- `max_history_tokens = 500`: The token budget for recent conversation history. Once exceeded, old turns are summarized.
- `recent_turns_kept = 2`: The minimum number of recent turns to always keep in full detail. These are never summarized, ensuring the model has full context for the most recent interaction.
- `self.summary`: Accumulates summaries of compressed turns. When new compression happens, the old summary is preserved and combined with the new one using "Earlier: ... More recently: ..." format.

## Key Takeaways

- **Progressive compression**: As conversations grow, older content is gradually compressed into summaries rather than being abruptly dropped. This preserves historical context in a token-efficient form.
- **Recent turns stay in full**: Keeping the most recent N turns uncompressed ensures the model has complete context for immediate follow-up questions while older context is distilled to key facts.
- **Summary accumulation**: The "Earlier: ... More recently: ..." pattern chains multiple compression events together, preserving a running history of the entire conversation even as it grows arbitrarily long.
- **Keyword-based vs. LLM summarization**: This example uses simple keyword extraction for demonstration. Production systems call the LLM itself to generate natural-language summaries, which are more accurate but more expensive (requiring an extra API call per compression event).
- **Token budget enforcement**: The compression trigger (`total_tokens > max_history_tokens`) ensures the conversation never exceeds the allocated budget, preventing context window overflow that would cause API errors or force truncation of important content.
