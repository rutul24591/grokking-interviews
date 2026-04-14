"""
Example 3: Agent Memory Management with Context Compression

Demonstrates:
- Short-term, working, and long-term memory separation
- Context window management through summarization
- Memory retrieval from long-term storage
- Sliding window with important fact preservation
"""

from typing import List, Dict, Any, Optional
from dataclasses import dataclass, field
import json


@dataclass
class MemoryItem:
    """A single memory item with metadata."""
    content: str
    item_type: str  # "observation", "fact", "goal", "reasoning"
    importance: float  # 0.0-1.0, determines if it should be preserved
    iteration: int


class MemoryManager:
    """
    Manages agent memory across three tiers:
    - Short-term: Active context window (recent turns + critical facts)
    - Working: Intermediate reasoning and partial results
    - Long-term: Persisted facts and learned knowledge (vector DB / storage)
    """

    def __init__(
        self,
        max_context_tokens: int = 100_000,
        summarize_threshold: float = 0.7,  # Compress when 70% full
        importance_threshold: float = 0.6,  # Keep items above this importance
    ):
        self.max_context_tokens = max_context_tokens
        self.summarize_threshold = summarize_threshold
        self.importance_threshold = importance_threshold

        # Short-term: what's in the active context window
        self.short_term: List[MemoryItem] = []
        # Working: scratchpad for current task
        self.working: Dict[str, Any] = {}
        # Long-term: persisted knowledge (simulated as a list)
        self.long_term: List[Dict[str, Any]] = []

        self.current_tokens = 0
        self._compression_history: List[str] = []

    def _estimate_tokens(self, text: str) -> int:
        """Rough token estimation (in production, use the actual tokenizer)."""
        return len(text.split()) * 1.3  # ~1.3 tokens per word

    def add(self, content: str, item_type: str, importance: float, iteration: int) -> None:
        """Add a memory item and check if compression is needed."""
        item = MemoryItem(content=content, item_type=item_type, importance=importance, iteration=iteration)
        self.short_term.append(item)
        self.current_tokens += self._estimate_tokens(content)

        # Check if we need to compress
        if self.current_tokens > self.max_context_tokens * self.summarize_threshold:
            self._compress()

    def _compress(self) -> None:
        """
        Compress context by:
        1. Keeping high-import items
        2. Summarizing low-import observations
        3. Moving important facts to long-term memory
        """
        # Separate items by importance
        keep = []
        summarize = []
        archive = []

        for item in self.short_term:
            if item.importance >= 0.8:
                keep.append(item)  # Critical facts stay in context
            elif item.importance >= self.importance_threshold:
                archive.append(item)  # Move to long-term
            else:
                summarize.append(item)  # Summarize

        # Summarize low-importance observations
        if summarize:
            summary_text = self._generate_summary(summarize)
            summary_item = MemoryItem(
                content=summary_text,
                item_type="summary",
                importance=0.5,
                iteration=summarize[-1].iteration,
            )
            keep.append(summary_item)

        # Move important items to long-term
        for item in archive:
            self.long_term.append({
                "content": item.content,
                "type": item.item_type,
                "iteration_stored": item.iteration,
            })

        self.short_term = keep
        self.current_tokens = sum(self._estimate_tokens(i.content) for i in keep)

    def _generate_summary(self, items: List[MemoryItem]) -> str:
        """Generate a compressed summary of items (simulated)."""
        observations = [i.content[:50] for i in items if i.item_type == "observation"]
        return f"Summary of {len(items)} previous steps: {'; '.join(observations[:3])}..."

    def get_context(self) -> str:
        """Get the current context window content formatted for the LLM."""
        lines = []
        for item in self.short_term:
            prefix = {
                "observation": "OBS",
                "fact": "FACT",
                "goal": "GOAL",
                "reasoning": "THOUGHT",
                "summary": "SUMMARY",
            }.get(item.item_type, "?")
            lines.append(f"[{prefix}] {item.content}")
        return "\n".join(lines)

    def retrieve_relevant(self, query: str, top_k: int = 3) -> List[Dict]:
        """Retrieve relevant items from long-term memory (simulated keyword match)."""
        # In production, this would be a vector similarity search
        query_words = set(query.lower().split())
        scored = []
        for item in self.long_term:
            item_words = set(item["content"].lower().split())
            overlap = len(query_words & item_words) / max(len(query_words), 1)
            scored.append((overlap, item))
        scored.sort(reverse=True)
        return [item for _, item in scored[:top_k]]

    def get_status(self) -> Dict[str, Any]:
        """Get memory status for monitoring."""
        return {
            "short_term_items": len(self.short_term),
            "long_term_items": len(self.long_term),
            "current_tokens": round(self.current_tokens),
            "max_tokens": self.max_context_tokens,
            "utilization": f"{self.current_tokens / self.max_context_tokens * 100:.1f}%",
            "working_memory_keys": list(self.working.keys()),
        }


def main():
    memory = MemoryManager(max_context_tokens=100_000)

    # Simulate agent interaction
    memory.add("Goal: Investigate the production latency spike", "goal", 0.95, 1)
    memory.add("Checked metrics dashboard — P99 latency jumped from 50ms to 500ms at 14:00 UTC", "observation", 0.9, 1)
    memory.add("Need to check which service is affected", "reasoning", 0.4, 2)
    memory.add("Queried service health endpoint — payment-service is returning 503", "observation", 0.85, 3)
    memory.add("Payment-service depends on the Redis cache cluster", "fact", 0.8, 3)
    memory.add("Checking Redis cluster status...", "reasoning", 0.3, 4)
    memory.add("Redis cluster node-3 is down — failover to node-4 is in progress but stuck", "observation", 0.95, 5)

    # Add more to trigger compression
    for i in range(6, 15):
        memory.add(f"Step {i}: Iterative investigation detail that adds context but is low importance", "observation", 0.2, i)

    print("=== Memory Status ===")
    status = memory.get_status()
    for key, value in status.items():
        print(f"  {key}: {value}")

    print(f"\n=== Current Context (compressed) ===")
    print(memory.get_context()[:500])

    print(f"\n=== Long-Term Memory ({len(memory.long_term)} items) ===")
    for item in memory.long_term:
        print(f"  [{item['type']}] {item['content'][:60]}...")

    # Retrieve relevant info
    print(f"\n=== Retrieval for 'Redis cluster' ===")
    relevant = memory.retrieve_relevant("Redis cluster", top_k=3)
    for item in relevant:
        print(f"  [{item['type']}] {item['content'][:80]}...")


if __name__ == "__main__":
    main()
